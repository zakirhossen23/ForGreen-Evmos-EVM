import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import useContract from '../../../services/useContract';


export default function ChooseProjectModal({
	show,
	onHide,
	contract,
	sendTransaction,
	grantId,

}) {

	const [list, setList] = useState([]);
	const sleep = (milliseconds) => {
		return new Promise(resolve => setTimeout(resolve, milliseconds))
	}



	async function fetchContractData() {
		try {
			if (contract) {

				const AllEvents = await contract.getSearchEventbyWallet(window.ethereum.selectedAddress).call();
				const arr = [];
				for (let i = 0; i < AllEvents.length; i++) {
					const value = AllEvents[i];
					const eventid =Number( await contract.getEventIdByURI(value).call());
					console.log("here");
					const ISsubmitted = await contract.getCheckSubmittedProjectGrant(grantId,eventid)
					if (value) {
						const object = JSON.parse(value);
						var c = new Date(object.properties.Date.description).getTime();
							var n = new Date().getTime();
							var d = c - n;
							var s = Math.floor((d % (1000 * 60)) / 1000);
							if (s.toString().includes("-")) {
								continue;
							}
							arr.push({
								eventId: eventid,
								Title: object.properties.Title.description,
								Date: object.properties.Date.description,
								Goal: object.properties.Goal.description,
								logo: object.properties.logo.description.url,
								isSubmitted: ISsubmitted
							});
					}
				}
				setList(arr);
			}
		} catch (error) {
			console.error(error);
		}
	}
	useEffect(() => {
		fetchContractData();

	}, [contract]);

	async function choosenProject(id) {
		
        try {
            const result = await sendTransaction(contract.CreateGrantProject(id,grantId));

        } catch {
            window.location.href = ('/login');
        }

		window.location.reload();
	}


	return (
		<Modal
			show={show}
			onHide={onHide}
			onShow={fetchContractData}
			aria-labelledby="contained-modal-title-vcenter"
			centered
			size='lg'
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					Choose project
				</Modal.Title>
			</Modal.Header>
			<Modal.Body className="show-grid">
				<div className='Project-ALL-project-Container'>
					{list.map((item, i) => {
						return <>
							<div onClick={()=>{if (item.isSubmitted != true){choosenProject(item.eventId)}}} className={(item.isSubmitted == true)?("Project-Project-Container-disabled"):("Project-Project-Container")} >
								<div className={(item.isSubmitted != true)?("Project-Image-Container"):("Project-Image-Container-disabled")}>
									<img
										className="Event-Uploaded-File-clip-icon"
										src={item.logo}
										style={{ width: "90%", height: "90%" }}
									/>
									<span className="Event-Uploaded-File-name" >
										{item.Title.substring(0, 20)}...
									</span>
								</div>
							</div>
						</>
					})}
				</div>
			</Modal.Body>

		</Modal>

	);
}
