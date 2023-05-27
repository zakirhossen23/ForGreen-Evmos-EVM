import TronWeb from 'tronweb';

export default async function useContract(privateKey) {
	let contract = null;

	const tronWeb = new TronWeb({
		fullHost: 'https://api.trongrid.io'
	});
	contract = await tronWeb.contract().at('TR4fkthXhTsXmVFmMTco7eDcApx3aU9KiY');

	return contract;
}

