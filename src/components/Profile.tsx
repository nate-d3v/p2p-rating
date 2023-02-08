import { useState, useEffect } from 'react';
import { useSignMessage } from 'wagmi';
import { useRouter } from 'next/router';

export default function Profile({
	address,
	isOwn,
	ratings,
	activeUserAddress,
	dbFunction,
	isVerified,
}: any) {
	const router = useRouter();
	const [rating, setRating] = useState('1');
	const [alreadyRated, setAlreadyRated] = useState(false);
	const { signMessage, isSuccess, isLoading } = useSignMessage({
		message: 'Sign this message to prove ownership',
	});

	useEffect(() => {
		if (isSuccess) {
			const verifyOwnership = async () => {
				await dbFunction('PUT', {
					data: {
						requestedAddress: address,
						isOwn: true,
					},
				});
			};
			verifyOwnership();
			router.reload();
		}
	}, [isLoading]);

	useEffect(() => {
		let hasRated = ratings
			.map((item: any) => item[0])
			.includes(activeUserAddress);
		if (hasRated) {
			setAlreadyRated(true);
		} else {
			setAlreadyRated(false);
		}
	}, [ratings]);

	return (
		<>
			<div className="flex flex-col w-1/3 drop-shadow-lg bg-white p-4 min-w-[45%]">
				{isOwn ? (
					<h2 className="font-bold text-lg">Your Profile</h2>
				) : (
					<h2 className="font-bold text-lg">Requested Profile</h2>
				)}
				{isOwn && address === '' && (
					<h2>Connect your wallet to see your profile</h2>
				)}
				{!isOwn && address === activeUserAddress && address !== '' ? (
					<span>You can't rate yourself!</span>
				) : (
					<h3>{address}</h3>
				)}
				{isOwn
					? address !== '' && (
							<h2>Verified profile: {isVerified ? 'YES' : 'NO'}</h2>
					  )
					: address !== '' &&
					  address !== activeUserAddress && (
							<h2>Verified profile: {isVerified ? 'YES' : 'NO'}</h2>
					  )}
				{!isOwn &&
					address !== '' &&
					!alreadyRated &&
					address !== activeUserAddress &&
					activeUserAddress !== '' && (
						<div className="flex flex-col my-2">
							<h3>Rate this user:</h3>
							<div className="flex">
								<ul className="flex items-center gap-x-4">
									<li>
										<input
											type="radio"
											name="rating"
											value="1"
											onChange={e => setRating(e.target.value)}
										/>
										1
									</li>
									<li>
										<input
											type="radio"
											name="rating"
											value="2"
											onChange={e => setRating(e.target.value)}
										/>
										2
									</li>
									<li>
										<input
											type="radio"
											name="rating"
											value="3"
											onChange={e => setRating(e.target.value)}
										/>
										3
									</li>
									<li>
										<input
											type="radio"
											name="rating"
											value="4"
											onChange={e => setRating(e.target.value)}
										/>
										4
									</li>
									<li>
										<input
											type="radio"
											name="rating"
											value="5"
											onChange={e => setRating(e.target.value)}
										/>
										5
									</li>
								</ul>
								<button
									onClick={async () => {
										const res = await dbFunction('PUT', {
											data: {
												address: activeUserAddress,
												requestedAddress: address,
												rating: rating,
												isOwn: false,
											},
										});
										router.reload();
									}}
									className="bg-green-500 rounded-lg px-3 py-1 ml-4 border-[1px] border-gray-600 max-w-[5rem]"
								>
									Rate
								</button>
							</div>
						</div>
					)}
				{isOwn && address !== '' && !isVerified && (
					<button
						onClick={() => signMessage()}
						className="bg-green-500 rounded-lg px-3 py-1 border-[1px] border-gray-600 max-w-[10rem] my-2"
					>
						Verify ownership
					</button>
				)}
				{isOwn
					? address !== '' && (
							<div className="flex flex-col">
								{ratings.length !== 0 && (
									<table className="table-auto">
										<thead>
											<tr>
												<th>Address</th>
												<th>Rating</th>
												<th>Date</th>
											</tr>
										</thead>
										<tbody>
											{ratings.map((item: any) => (
												<tr key={item[0]}>
													<td>{item[0]}</td>
													<td className="text-center">{item[1]}</td>
													<td className="text-center">{item[2]}</td>
												</tr>
											))}
										</tbody>
									</table>
								)}
							</div>
					  )
					: address !== '' &&
					  address !== activeUserAddress && (
							<div className="flex flex-col">
								{ratings.length !== 0 && (
									<table className="table-auto">
										<thead>
											<tr>
												<th>Address</th>
												<th>Rating</th>
												<th>Date</th>
											</tr>
										</thead>
										<tbody>
											{ratings.map((item: any) => (
												<tr key={item[0]}>
													<td>{item[0]}</td>
													<td className="text-center">{item[1]}</td>
													<td className="text-center">{item[2]}</td>
												</tr>
											))}
										</tbody>
									</table>
								)}
							</div>
					  )}
			</div>
		</>
	);
}
