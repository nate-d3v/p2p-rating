import Head from 'next/head';
import { Web3Button } from '@web3modal/react';
import { useState, useEffect } from 'react';
import { PrismaClient } from '@prisma/client';
import { Dropdown, Profile } from '@/components';
import { useAccount } from 'wagmi';

const prisma = new PrismaClient();

export async function getServerSideProps() {
	try {
		const dbData = await prisma.user.findMany();
		return { props: { dbData } };
	} catch (err) {
		console.log(err);
	}
}

export async function dbRequest(data: any, method: any) {
	const request = await fetch('/api/db', {
		method: method,
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json',
		},
	});
	return request.json();
}

type Address = `0x${string}`;

export default function Home({ dbData }: any) {
	const { address, isConnected } = useAccount();
	const [inputValue, setInputValue] = useState<Address | ''>('');
	const [requestedAddress, setRequestedAddress] = useState<Address | ''>('');
	const [ownAddress, setOwnAddress] = useState<Address | ''>('');
	const [activeUserRatings, setActiveUserRatings] = useState([]);
	const [requestedUserRatings, setRequestedUserRatings] = useState([]);

	useEffect(() => {
		if (isConnected) {
			setOwnAddress(address!);
			setActiveUserRatings(
				dbData.find((el: any) => el.address === address).ratings
			);
		}
	}, [isConnected]);

	useEffect(() => {
		if (requestedAddress !== '') {
			//should be a GET request each time
			setRequestedUserRatings(
				dbData.find((el: any) => el.address === requestedAddress).ratings
			);
		}
	}, [requestedAddress]);

	const onInputChange = (e: any) => {
		setInputValue(e.target.value);
	};

	const onSearch = (searchValue: any) => {
		setInputValue(searchValue);
		if (searchValue.length === 42) {
			const userExists = dbData
				.map((el: any) => el.address)
				.includes(searchValue);
			if (userExists) {
				setRequestedAddress(searchValue);
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
				<Web3Button />
				<div className="flex">
					<Profile
						address={ownAddress}
						isOwn={true}
						activeUserAddress={ownAddress}
						ratings={activeUserRatings}
					/>
					<Profile
						address={requestedAddress}
						isOwn={false}
						activeUserAddress={ownAddress}
						ratings={requestedUserRatings}
					/>
				</div>
				<input type="text" value={inputValue} onChange={onInputChange} />
				<button
					onClick={() => {
						onSearch(inputValue);
					}}
				>
					Search
				</button>
				{inputValue.length === 42 && inputValue !== requestedAddress && (
					<button
						onClick={async () => {
							const res = await dbRequest(
								{
									data: {
										address: inputValue,
									},
								},
								'POST'
							);
						}}
					>
						Add user
					</button>
				)}
				<Dropdown data={dbData} value={inputValue} searchFunction={onSearch} />
			</main>
		</>
	);
}
