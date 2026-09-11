import { Request, Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

// ==========================================
// CREATE PACKAGE (Admin)
// ==========================================
export const createPackage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      type,
      departureCity,
      travelDate,
      returnDate,
      duration,
      totalPrice,
      advancePercent = 20,
      availableSeats,
      description,
      posterUrl,
      hotels = [],
      inclusions = [],
      itinerary = [],
    } = req.body;

    const travel = new Date(travelDate);
    const returnD = new Date(returnDate);

    if (returnD <= travel) {
      res.status(400).json({
        success: false,
        message: 'Return date must be after travel date',
      });
      return;
    }

    const newPackage = await prisma.package.create({
      data: {
        name,
        type,
        departureCity,
        travelDate: travel,
        returnDate: returnD,
        duration,
        totalPrice,
        advancePercent,
        availableSeats,
        description,
        posterUrl: posterUrl || null,
        status: 'ACTIVE',
        hotels: {
          create: hotels.map((h: any) => ({
            city: h.city,
            name: h.name,
            stars: h.stars || 5,
            distance: h.distance || '',
            roomType: h.roomType || 'Double',
            nights: h.nights || 1,
          })),
        },
        inclusions: {
          create: inclusions.map((i: any) => ({
            name: typeof i === 'string' ? i : i.name,
            included: true,
          })),
        },
        itinerary: {
          create: itinerary.map((it: any, index: number) => ({
            day: it.day || index + 1,
            date: it.date ? new Date(it.date) : null,
            location: it.location || '',
            title: it.title || '',
            description: it.description || '',
            order: index,
          })),
        },
      },
      include: {
        hotels: true,
        inclusions: true,
        itinerary: { orderBy: { order: 'asc' } },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Package created successfully',
      data: { package: newPackage },
    });
  } catch (error: any) {
    console.error('Create package error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create package',
      error: error.message,
    });
  }
};

// ==========================================
// LIST PACKAGES (Public)
// ==========================================
export const listPackages = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      status,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      month,
    } = req.query as any;

    const where: any = {};

    const user = (req as AuthRequest).user;
    if (!user || user.role !== 'ADMIN') {
      where.status = 'ACTIVE';
    } else if (status) {
      where.status = status;
    }

    if (type) where.type = type;

    if (minPrice || maxPrice) {
      where.totalPrice = {};
      if (minPrice) where.totalPrice.gte = parseFloat(minPrice);
      if (maxPrice) where.totalPrice.lte = parseFloat(maxPrice);
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { departureCity: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (month) {
      const startOfMonth = new Date(`${month}-01`);
      const endOfMonth = new Date(startOfMonth);
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);

      where.travelDate = {
        gte: startOfMonth,
        lt: endOfMonth,
      };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const total = await prisma.package.count({ where });

    const packages = await prisma.package.findMany({
      where,
      skip,
      take,
      orderBy: { [sortBy]: sortOrder },
      include: {
        hotels: true,
        _count: { select: { bookings: true } },
      },
    });

    const packagesWithInfo = packages.map((pkg) => ({
      ...pkg,
      advanceAmount: Math.round((pkg.totalPrice * pkg.advancePercent) / 100),
      bookingCount: pkg._count.bookings,
    }));

    res.status(200).json({
      success: true,
      data: {
        packages: packagesWithInfo,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit)),
          hasNext: skip + take < total,
          hasPrev: parseInt(page) > 1,
        },
      },
    });
  } catch (error: any) {
    console.error('List packages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch packages',
      error: error.message,
    });
  }
};

// ==========================================
// GET SINGLE PACKAGE (Public)
// ==========================================
export const getPackage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const pkg = await prisma.package.findUnique({
      where: { id },
      include: {
        hotels: true,
        inclusions: true,
        itinerary: { orderBy: { order: 'asc' } },
        _count: { select: { bookings: true } },
      },
    });

    if (!pkg) {
      res.status(404).json({
        success: false,
        message: 'Package not found',
      });
      return;
    }

    const packageWithInfo = {
      ...pkg,
      advanceAmount: Math.round((pkg.totalPrice * pkg.advancePercent) / 100),
      remainingAmount: Math.round(
        pkg.totalPrice - (pkg.totalPrice * pkg.advancePercent) / 100
      ),
      bookingCount: pkg._count.bookings,
      seatsLeft: pkg.availableSeats - pkg._count.bookings,
    };

    res.status(200).json({
      success: true,
      data: { package: packageWithInfo },
    });
  } catch (error: any) {
    console.error('Get package error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch package',
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE PACKAGE (Admin)
// ==========================================
export const updatePackage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      name,
      type,
      departureCity,
      travelDate,
      returnDate,
      duration,
      totalPrice,
      advancePercent,
      availableSeats,
      description,
      posterUrl,
      status,
    } = req.body;

    const existing = await prisma.package.findUnique({ where: { id } });

    if (!existing) {
      res.status(404).json({
        success: false,
        message: 'Package not found',
      });
      return;
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (type) updateData.type = type;
    if (departureCity) updateData.departureCity = departureCity;
    if (travelDate) updateData.travelDate = new Date(travelDate);
    if (returnDate) updateData.returnDate = new Date(returnDate);
    if (duration) updateData.duration = duration;
    if (totalPrice) updateData.totalPrice = totalPrice;
    if (advancePercent) updateData.advancePercent = advancePercent;
    if (availableSeats !== undefined) updateData.availableSeats = availableSeats;
    if (description) updateData.description = description;
    if (posterUrl !== undefined) updateData.posterUrl = posterUrl;
    if (status) updateData.status = status;

    const updated = await prisma.package.update({
      where: { id },
      data: updateData,
      include: {
        hotels: true,
        inclusions: true,
        itinerary: { orderBy: { order: 'asc' } },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Package updated successfully',
      data: { package: updated },
    });
  } catch (error: any) {
    console.error('Update package error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update package',
      error: error.message,
    });
  }
};

// ==========================================
// DELETE PACKAGE (Admin)
// ==========================================
export const deletePackage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const existing = await prisma.package.findUnique({
      where: { id },
      include: {
        _count: { select: { bookings: true } },
      },
    });

    if (!existing) {
      res.status(404).json({
        success: false,
        message: 'Package not found',
      });
      return;
    }

    if (existing._count.bookings > 0) {
      res.status(400).json({
        success: false,
        message: `Cannot delete package. It has ${existing._count.bookings} booking(s). Deactivate it instead.`,
      });
      return;
    }

    await prisma.package.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: 'Package deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete package error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete package',
      error: error.message,
    });
  }
};

// ==========================================
// TOGGLE STATUS (Admin)
// ==========================================
export const togglePackageStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['ACTIVE', 'INACTIVE'].includes(status)) {
      res.status(400).json({
        success: false,
        message: 'Status must be ACTIVE or INACTIVE',
      });
      return;
    }

    const updated = await prisma.package.update({
      where: { id },
      data: { status },
    });

    res.status(200).json({
      success: true,
      message: `Package ${status === 'ACTIVE' ? 'activated' : 'deactivated'} successfully`,
      data: { package: updated },
    });
  } catch (error: any) {
    console.error('Toggle status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update package status',
      error: error.message,
    });
  }
};

// ==========================================
// PACKAGE STATS (Admin)
// ==========================================
export const getPackageStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const [total, active, inactive, hajj, umrah] = await Promise.all([
      prisma.package.count(),
      prisma.package.count({ where: { status: 'ACTIVE' } }),
      prisma.package.count({ where: { status: 'INACTIVE' } }),
      prisma.package.count({ where: { type: 'HAJJ' } }),
      prisma.package.count({ where: { type: 'UMRAH' } }),
    ]);

    res.status(200).json({
      success: true,
      data: { total, active, inactive, hajj, umrah },
    });
  } catch (error: any) {
    console.error('Package stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch package stats',
      error: error.message,
    });
  }
};