export default function Profile({
	address,
	isOwn,
	activeUserAddress,
	ratings,
}: any) {
	return (
		<>
			<div className="flex flex-col w-1/3">
				{isOwn ? <h2>Your Profile</h2> : <h2>Requested Profile</h2>}
				{!isOwn && address === activeUserAddress && address !== '' ? (
					<span>You can't rate yourself!</span>
				) : (
					<h3>{address}</h3>
				)}
				<div className="flex flex-col">
					{ratings.map((item: any) => {
						<div key={item[0]} className="flex">
							<h4>{item[0]}</h4>
							<span>{item[1]}</span>
							<span>{item[2]}</span>
						</div>;
					})}
				</div>
			</div>
		</>
	);
}
