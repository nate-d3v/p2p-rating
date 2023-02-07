import Head from 'next/head';
import { Web3Button } from '@web3modal/react';
import { useState, useEffect } from 'react';
import { PrismaClient } from '@prisma/client';
import { Dropdown, Profile } from '@/components';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/router';

const prisma = new PrismaClient();

export async function getServerSideProps() {
	try {
		const dbData = await prisma.userTest.findMany();
		return { props: { dbData } };
	} catch (err) {
		console.log(err);
	}
}

export async function dbRequest(method: any, data?: any, address?: any) {
	if (method === 'GET') {
		const request = await fetch(`/api/db?address=${address}`, {
			method: method,
			headers: {
				'Content-Type': 'application/json',
			},
		});
		return request.json();
	} else {
		const request = await fetch('/api/db', {
			method: method,
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
			},
		});
		return request.json();
	}
}

type Address = `0x${string}`;

export default function Home({ dbData }: any) {
	const router = useRouter();
	const { address, isConnected } = useAccount();
	const [inputValue, setInputValue] = useState<Address | ''>('');
	const [requestedAddress, setRequestedAddress] = useState<Address | ''>('');
	const [ownAddress, setOwnAddress] = useState<Address | ''>('');
	const [activeUserRatings, setActiveUserRatings] = useState([]);
	const [requestedUserRatings, setRequestedUserRatings] = useState([]);
	const [activeUserVerified, setActiveUserVerified] = useState(false);
	const [requestedUserVerified, setRequestedUserVerified] = useState(false);

	useEffect(() => {
		if (isConnected) {
			setOwnAddress(address!);
		} else {
			setOwnAddress('');
			setRequestedAddress('');
		}
	}, [isConnected]);

	useEffect(() => {
		if (ownAddress) {
			const getActiveUserData = async () => {
				const userData = await dbRequest('GET', undefined, ownAddress);
				if (userData) {
					setActiveUserRatings(userData.ratings);
					setActiveUserVerified(userData.verified);
				}
			};
			getActiveUserData();
		}
	}, [ownAddress]);

	useEffect(() => {
		if (requestedAddress !== '') {
			const getRequestedAddressData = async () => {
				const userData = await dbRequest('GET', undefined, requestedAddress);
				setRequestedUserRatings(userData.ratings);
				setRequestedUserVerified(userData.verified);
			};
			getRequestedAddressData();
		}
	}, [requestedAddress]);

	useEffect(() => {
		console.log(requestedUserRatings);
	}, [requestedUserRatings]);

	const onSearch = (searchValue: any) => {
		setInputValue(searchValue);
		if (searchValue.length === 42) {
			const userExists = dbData
				.map((el: any) => el.address)
				.includes(searchValue);
			if (userExists) {
				setRequestedAddress(searchValue);
				setInputValue('');
			} else {
				setRequestedAddress('');
			}
		}
	};

	return (
		<>
			<Head>
				<title>P2P rating app</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="flex flex-col min-h-screen">
				<div className="flex justify-center my-6">
					<Web3Button icon="hide" />
				</div>
				<div className="flex min-h-[55vh] justify-evenly">
					<Profile
						address={ownAddress}
						isOwn={true}
						ratings={activeUserRatings}
						isVerified={activeUserVerified}
						activeUserAddress={ownAddress}
						dbFunction={dbRequest}
					/>
					<Profile
						address={requestedAddress}
						isOwn={false}
						ratings={requestedUserRatings}
						isVerified={requestedUserVerified}
						activeUserAddress={ownAddress}
						dbFunction={dbRequest}
					/>
				</div>
				<div className="flex flex-col items-center min-h-[30vh] mt-4">
					<input
						type="text"
						value={inputValue}
						onChange={(e: any) => setInputValue(e.target.value)}
						className="min-w-[24rem] border-2 border-gray-200 mb-2"
					/>
					<button
						onClick={() => {
							onSearch(inputValue);
						}}
						className="bg-blue-600 rounded-lg text-lg text-white px-3 py-2 font-medium"
					>
						Search
					</button>
					{inputValue.length === 42 && inputValue !== requestedAddress && (
						<button
							onClick={async () => {
								const res = await dbRequest('POST', {
									data: {
										address: inputValue,
									},
								});
								router.reload();
							}}
							className="bg-blue-600 rounded-lg text-lg text-white px-3 py-2 font-medium mt-2"
						>
							Add user
						</button>
					)}
					<Dropdown
						data={dbData}
						value={inputValue}
						searchFunction={onSearch}
					/>
				</div>
			</main>
		</>
	);
}
