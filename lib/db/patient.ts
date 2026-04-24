// import { prisma } from "@/lib/prisma";
// export async function getPatients(search?: string) {
//   return prisma.patient.findMany({
//     where: search
//       ? {
//           OR: [
//             {
//               firstName: {
//                 contains: search,
//                 mode: "insensitive", 
//               },
//             },
//             {
//               lastName: {
//                 contains: search,
//                 mode: "insensitive",
//               },
//             },
//             {
//               fiscalCode: {
//                 contains: search,
//                 mode: "insensitive",
//               },
//             },
//             {
//               email: {
//                 contains: search,
//                 mode: "insensitive",
//               },
//             },
//           ],
//         }
//       : undefined,
//     include: {
//       visits: {
//         orderBy: {
//           visitDate: "desc", 
//         },
//         select: {
//           id: true,
//           visitDate: true,
//         },
//       },
//     },
//     orderBy: {
//       lastName: "asc",
//     },
//   });
// }

import { prisma } from "@/lib/prisma";

/**
 * Lista pazienti con ricerca + visite
 */
export async function getPatients(search?: string) {
  return prisma.patient.findMany({
    where: search
      ? {
          OR: [
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
            { fiscalCode: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined,

    include: {
      visits: {
        orderBy: {
          visitDate: "desc",
        },
        select: {
          id: true,
          visitDate: true,
        },
      },
    },

    orderBy: {
      lastName: "asc",
    },
  });
}

/**
 * Paziente singolo SENZA visite
 */
export async function getPatientById(id: string) {
  return prisma.patient.findUnique({
    where: { id },
  });
}

/**
 * Paziente con visite (USATO NEL DETTAGLIO)
 */
export async function getPatientWithVisits(id: string) {
  return prisma.patient.findUnique({
    where: { id },
    include: {
      visits: {
        orderBy: {
          visitDate: "desc",
        },
      },
    },
  });
}