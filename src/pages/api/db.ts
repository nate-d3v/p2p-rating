import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	if (req.method === 'POST') {
		const { data } = req.body;
		const getUser = await prisma.userTest.findFirst({
			where: {
				address: data.address,
			},
		});
		if (!getUser) {
			const createUser = await prisma.userTest.create({
				data: {
					address: data.address,
					verified: false,
					ratings: [],
				},
			});
			res.status(200).json(createUser);
		}
	} else if (req.method === 'PUT') {
		const { data } = req.body;
		const getUser = await prisma.userTest.findFirst({
			where: {
				address: data.requestedAddress,
			},
		});
		if (data.isOwn === true) {
			if (!getUser) {
				const createUser = await prisma.userTest.create({
					data: {
						address: data.requestedAddress,
						verified: true,
						ratings: [],
					},
				});
				res.status(200).json(createUser);
			} else {
				const updateVerified = await prisma.userTest.update({
					where: {
						id: getUser!.id,
					},
					data: {
						verified: true,
					},
				});
				res.status(200).json(updateVerified);
			}
		} else if (data.isOwn === false) {
			const ratings = getUser?.ratings as Prisma.JsonArray;

			if (!ratings.map((item: any) => item[0]).includes(data.address)) {
				const date = new Date().toISOString().slice(0, 10);
				ratings.push([data.address, data.rating, date]);
				const updateRatings = await prisma.userTest.update({
					where: {
						id: getUser!.id,
					},
					data: {
						ratings: ratings,
					},
				});
				res.status(200).json(updateRatings);
			}
		}
	} else if (req.method === 'GET') {
		const { address } = req.query;
		const getUser = await prisma.userTest.findFirst({
			where: {
				address: address as string,
			},
		});
		res.status(200).json(getUser);
	} else {
		res.status(400).send('Wrong method');
	}
}
