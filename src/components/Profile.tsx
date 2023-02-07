import { useState, useEffect } from 'react';

export default function Profile({
	address,
	isOwn,
	ratings,
	activeUserAddress,
	dbFunction,
	isVerified,
}: any) {
	const [rating, setRating] = useState('1');
	const [alreadyRated, setAlreadyRated] = useState(false);

	useEffect(() => {
		let hasRated = ratings
			.map((item: any) => item[0])
			.includes(activeUserAddress);
		if (hasRated) {
			setAlreadyRated(true);
		}
	}, [alreadyRated]);

	return (
		<>
			<div className="flex flex-col w-1/3">
				{isOwn ? <h2>Your Profile</h2> : <h2>Requested Profile</h2>}
				{!isOwn && address === activeUserAddress && address !== '' ? (
					<span>You can't rate yourself!</span>
				) : (
					<h3>{address}</h3>
				)}
				{!isOwn && address !== '' && alreadyRated && (
					<div>
						<h3>Rate this user:</h3>
						<ul className="flex gap-x-4">
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
							}}
						>
							Rate
						</button>
					</div>
				)}
				{address !== '' && (
					<h2>Verified profile: {isVerified ? 'YES' : 'NO'}</h2>
				)}
				{isOwn && !isVerified && <button>Sign and verify</button>}
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
										<td>{item[1]}</td>
										<td>{item[2]}</td>
									</tr>
								))}
							</tbody>
						</table>
					)}
				</div>
			</div>
		</>
	);
}
