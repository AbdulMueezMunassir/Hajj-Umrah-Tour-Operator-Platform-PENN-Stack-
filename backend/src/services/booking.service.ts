import prisma from '../config/database';

// ==========================================
// GENERATE BOOKING REFERENCE
// ==========================================
export const generateBookingRef = async (type: 'HAJJ' | 'UMRAH'): Promise<string> => {
  const prefix = type === 'HAJJ' ? 'MHK-HAJ' : 'MHK-UMR';
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');

  // Count bookings this year
  const count = await prisma.booking.count({
    where: {
      bookingRef: {
        startsWith: `${prefix}-${year}`,
      },
    },
  });

  const sequence = String(count + 1).padStart(4, '0');
  return `${prefix}-${year}${month}-${sequence}`;
};

// ==========================================
// CALCULATE BOOKING PRICES
// ==========================================
export const calculateBookingPrices = (
  packagePrice: number,
  advancePercent: number,
  travellerCount: number
) => {
  const totalAmount = packagePrice * travellerCount;
  const advancePaid = Math.round((totalAmount * advancePercent) / 100);
  const balanceDue = totalAmount - advancePaid;

  return {
    totalAmount,
    advancePaid,
    balanceDue,
  };
};

// ==========================================
// CHECK SEAT AVAILABILITY
// ==========================================
export const checkSeatAvailability = async (
  packageId: string,
  requestedSeats: number
): Promise<{ available: boolean; seatsLeft: number }> => {
  const pkg = await prisma.package.findUnique({
    where: { id: packageId },
    include: {
      _count: {
        select: {
          bookings: {
            where: {
              bookingStatus: {
                notIn: ['CANCELLED'],
              },
            },
          },
        },
      },
    },
  });

  if (!pkg) {
    return { available: false, seatsLeft: 0 };
  }

  const bookedSeats = pkg._count.bookings;
  const seatsLeft = pkg.availableSeats - bookedSeats;

  return {
    available: seatsLeft >= requestedSeats,
    seatsLeft,
  };
};