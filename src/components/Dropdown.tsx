export default function Dropdown({ data, value, searchFunction }: any) {
	const addressesArray = data.filter((item: any) => {
		const searchValue = value.toLowerCase();
		const address = item.address.toLowerCase();

		return (
			searchValue && address.startsWith(searchValue) && searchValue !== address
		);
	});

	return (
		<>
			<div className="flex flex-col border-2 border-gray-200 px-2">
				{addressesArray.slice(0, 5).map((item: any) => (
					<h3 key={item.id} onClick={() => searchFunction(item.address)}>
						{item.address}
					</h3>
				))}
			</div>
		</>
	);
}
