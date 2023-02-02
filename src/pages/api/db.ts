import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	if (req.method === 'POST') {
		const { data } = req.body;
		const createUser = await prisma.user.create({
			data: {
				address: data.address,
				verified: false,
				ratings: [],
			},
		});
		res.status(200).json(createUser);
	} else {
		res.status(400).send('Wrong method');
	}
}
