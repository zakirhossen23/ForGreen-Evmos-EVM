import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import UseFormInput from '../UseFormInput';

export default function BidNFTModal({
	show,
	onHide,
	contract,
	sendTransaction,
	senderAddress,
	tokenId,
	eventId,
	toAddress,
	type,
	Highestbid

}) {
	const [Alert, setAlert] = useState('');

	const sleep = (milliseconds) => {
		return new Promise(resolve => setTimeout(resolve, milliseconds))
	}


	const [Amount, AmountInput] = UseFormInput({
		type: 'text',
		placeholder: 'Amount',
	});


	function activateWarningModal(TextAlert) {
		var alertELM = document.getElementById("alert");
		alertELM.style = 'contents';
		setAlert(TextAlert)
	}
	function activateWorkingModal(TextAlert) {
		var alertELM = document.getElementById("workingalert");
		alertELM.style = 'contents';
		setAlert(TextAlert)
	}

	async function bidNFT() {

		var BidNFTBTN = document.getElementById("bidNFTBTN")
		BidNFTBTN.disabled = true;
		console.log("bidding")
		if (Number(Amount) < Number(Highestbid)) {
			activateWarningModal(`Amount cannot be under ${Highestbid} tEVMOS`);
			return;
		} else {
			var alertELM = document.getElementById("alert");
			alertELM.style.display = 'none';
		}
		try {
			activateWorkingModal("Bidding....")

			activateWorkingModal("A moment please")
			var tronweb = window.tronWeb
			var tx = await tronweb.transactionBuilder.sendTrx(toAddress, (Number(Amount) * 1e6).toFixed(5), window?.tronWeb?.defaultAddress?.base58.toString())
			var signedTx = await tronweb.trx.sign(tx)
			var broastTx = await tronweb.trx.sendRawTransaction(signedTx)

			activateWorkingModal("Done! Adding into tEVMOS Network...")

			const tokenUri = await contract.tokenURI(tokenId).call();
			var parsed = await JSON.parse(tokenUri);
			if (Number(parsed['properties']['price']['description']) < Number(Amount)) {
				parsed['properties']['price']['description'] = Amount;
				parsed['properties']['higherbidadd']['description'] = senderAddress;

			}
			let currentDate = new Date();
			const createdObject = {
				title: 'Asset Metadata Bids',
				type: 'object',
				properties: {
					username: {
						type: 'string',
						description: senderAddress
					},
					bid: {
						type: 'string',
						description: Amount
					},
					time: {
						type: 'string',
						description: currentDate
					}
				}
			};
			activateWorkingModal("Please confirm creating Bid...")
			const totalraised = await contract.getEventRaised(Number(eventId)).call();
			let Raised = 0;
			Raised = Number(totalraised) + Number(Amount);
			console.log("doen")
			const result2 = await sendTransaction(contract.createBid(tokenId, JSON.stringify(createdObject), JSON.stringify(parsed), eventId, Raised.toString()));
			activateWorkingModal("A moment please")
			activateWorkingModal("Success!")
			window.document.getElementsByClassName("btn-close")[0].click();
			BidNFTBTN.disabled = false;
			await sleep(200)
			window.location.reload();
		} catch (e) {
			console.error(e);
			activateWarningModal(`Error! Please try again!`);
			var alertELM = document.getElementById("workingalert");
			alertELM.style.display = 'none';
			return;
		}

	}

	return (
		<Modal
			show={show}
			onHide={onHide}
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					Bid NFT
				</Modal.Title>
			</Modal.Header>
			<Modal.Body className="show-grid">
				<Form>
					<div id='alert' style={{ display: 'none', fontSize: "30px" }} className="alert alert-danger" role="alert">
						{Alert}
					</div>
					<div id='workingalert' style={{ display: 'none', fontSize: "30px" }} className="alert alert-success" role="alert">
						{Alert}
					</div>
					<Form.Group className="mb-3" controlId="formGroupName">
						<Form.Label>Bid Amount in tEVMOS</Form.Label>
						{AmountInput}
					</Form.Group>
					<div className="d-grid">
						<Button variant="primary" id="bidNFTBTN" onClick={bidNFT}>
							Bid NFT
						</Button>

					</div>
				</Form>
			</Modal.Body>

		</Modal>

	);
}
