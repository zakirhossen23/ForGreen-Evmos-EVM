// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/Strings.sol";
import "./precompiles/stateful/Staking.sol";
import "./precompiles/stateful/Distribution.sol";

contract ForGreen{


    struct UnbondingRequest {
        int64 completionTime;
        uint256 amount;
    }
    /// @dev the required authorizations for Staking and Distribution
    string[] private stakingMethods = [MSG_DELEGATE, MSG_UNDELEGATE, MSG_REDELEGATE];
    string[] private distributionMethods = [MSG_WITHDRAW_DELEGATOR_REWARD];
    /// @dev map to keep track of user deposits to the contract.
    mapping(uint256 => uint256) public donated;                                // _ideas_ids       => (Ideas) donated amount
    uint256 private _total_delegations;
    string private _validatorAddr  = "evmosvaloper158wwas4v6fgcu2x3plg70s6u0fm0lle237kltr";
    /// @dev map that keeps track of all currently unbonding delegations
    mapping(uint256 => UnbondingRequest) public unbondingDelegations;           // _ideas_ids       => (Ideas) UnbondingRequest
  


	uint256 private _tokenIds;
	uint256 private _bidIds;
	uint256 private _eventIds;
    uint256 public _GrantEventIds;
	uint256 public _GrantProjectIds;
	uint256 public _GrantVoteIds;
	uint256 private _EventTokenIds;
	uint256 private _TokenBidIds;
	uint256 public _EventTokenSearchIds;
	mapping(uint256 => string[2]) private AllEventTokens;
	mapping(uint256 => string[3]) private AllGrantVotes;
    mapping(uint256 => uint256[2]) private AllGrantProject;
	mapping(uint256 => string[2]) private AllTokensBids;
	mapping(uint256 => string[2]) public _SearchedStore;
	mapping(uint256 => string) private _bidURIs;
	mapping(uint256 => string) private _tokenURIs;
	mapping(uint256 => string[2]) private _eventURIs;
	mapping(uint256 => string) public _GrantEventURIs;
    mapping(uint256 => string) public  _JudgerURIs;
	mapping(uint256 => string) private _eventRaised;
	mapping(string => string) private _eventTokens;


function claimToken(
		address _claimer,
		string memory _tokenURI,
		uint256 _eventid
	) public returns (uint256) {
		_setTokenURI(_tokenIds, _tokenURI);
		_setTokenEvent(_EventTokenIds, _eventid, _tokenURI);
		_tokenIds++;
		_EventTokenIds++;
		return _tokenIds;
	}


function _setTokenEvent(
		uint256 EventTokenId,
		uint256 EventId,
		string memory _tokenURI
	) public virtual {
		AllEventTokens[EventTokenId] = [
			Strings.toString(EventId),
			string(_tokenURI)
		];
	}
function createEvent(string memory _eventWallet,string memory _eventURI)
		public
		returns (uint256)
	{
		_setEventURI(_eventIds,_eventWallet, _eventURI);
		_setEventRaised(_eventIds, "0");
		_eventIds++;

		return _eventIds;
	}
	

function setGrantProject(	
		uint256 GrantProjectId,
		uint256 ProjectId,
		uint256 GranttId
	) public virtual {
		AllGrantProject[GrantProjectId] = [GranttId,ProjectId];

	}


function CreateGrantProject(
		uint256 ProjectId,
		uint256 GranttId
	) public returns (uint256) {
		setGrantProject(_GrantProjectIds,ProjectId,GranttId);
		_GrantProjectIds++;
		
		return _GrantProjectIds;
	}




function createGrantEvent(string memory _eventURI)
		public
		returns (uint256)
	{
		_setGrantEventURI(_GrantEventIds, _eventURI);
		_GrantEventIds++;

		return _GrantEventIds;
	}


function getCheckSubmittedProjectGrant(uint256 Grantid, uint256 ProjectId)
		public
		view
		virtual
		returns (bool)
	{		
		
		for (uint256 i = 0; i < _GrantProjectIds; i++) {
			if (
				AllGrantProject[i][0] == Grantid && 
				AllGrantProject[i][1] == ProjectId 				
			) {
				return true;
			}
		}
		
		return false;
	}


function getSearchedProjectByGrantID(uint256 Grantid)
		public
		view
		virtual
		returns (uint256[] memory)
	{
		
		uint256 _TemporarySearch = 0;
		uint256 _SearchIds = 0;
		
		
		for (uint256 i = 0; i < _GrantProjectIds; i++) {
			if (
				AllGrantProject[i][0] == Grantid
			) {
				_TemporarySearch++;
			}
		}
		uint256[] memory _SearchedProject = new uint256[](_TemporarySearch);

		for (uint256 i = 0; i < _GrantProjectIds; i++) {
			if (
				AllGrantProject[i][0] == Grantid
			) {
				_SearchedProject[_SearchIds] = AllGrantProject[i][1];
				_SearchIds++;
			}
		}


		return _SearchedProject;
	}

function setGrantVote(	
		uint256 GrantVoteId,
		string memory Wallet,
		string memory  ProjectId,
		string memory  GranttId
	) public virtual {
		AllGrantVotes[GrantVoteId] = [GranttId,ProjectId,Wallet];

	}


function createGrantVote(string memory Wallet,uint256 ProjectId,uint256 GranttId)
		public
		returns (uint256)
	{
		setGrantVote(_GrantVoteIds, Wallet,Strings.toString(ProjectId),Strings.toString(GranttId));
		_GrantVoteIds++;

		return _GrantVoteIds;
	}
function getSearchedGrantVoteProject(uint256 Grantid,uint256 ProjectId)
		public
		view
		virtual
		returns (string[] memory)
	{
		
		uint256 _TemporarySearch = 0;
		uint256 _SearchIds = 0;
		
		
		for (uint256 i = 0; i < _GrantVoteIds; i++) {
			if (
				keccak256(bytes(AllGrantVotes[i][0])) == keccak256(bytes(Strings.toString(Grantid))) &&
				keccak256(bytes(AllGrantVotes[i][1])) == keccak256(bytes(Strings.toString(ProjectId)))
				
			) {
				_TemporarySearch++;
			}
		}
		string[] memory _SearchedProject = new string[](_TemporarySearch);

	
		for (uint256 i = 0; i < _GrantVoteIds; i++) {
			if (
				keccak256(bytes(AllGrantVotes[i][0])) == keccak256(bytes(Strings.toString(Grantid))) &&
				keccak256(bytes(AllGrantVotes[i][1])) == keccak256(bytes(Strings.toString(ProjectId)))
				
			) {
			_SearchedProject[_SearchIds] = AllGrantVotes[i][2];
			_SearchIds++;
			}
		}


		return _SearchedProject;
	}



function gettokenIdByUri(string memory _tokenURI)
		public
		view
		virtual
		returns (uint256)
	{
		for (uint256 i = 0; i < _tokenIds; i++) {
			if (
				keccak256(bytes(_tokenURIs[i])) == keccak256(bytes(_tokenURI))
			) {
				return i;
			}
		}

		return 0;
	}



function getEventIdByURI(string memory _eventURI)
		public
		view
		virtual
		returns (uint256)
	{
		for (uint256 i = 0; i < _eventIds; i++) {
			if (
				keccak256(bytes(_eventURIs[i][1])) == keccak256(bytes(_eventURI))
			) {
				return i;
			}
		}

		return 0;
	}

function getBidIdByUri(string memory _bidURI)
		public
		view
		virtual
		returns (uint256)
	{
		for (uint256 i = 0; i < _bidIds; i++) {
			if (keccak256(bytes(_bidURIs[i])) == keccak256(bytes(_bidURI))) {
				return i;
			}
		}

		return 0;
	}

function gettokenSearchEventTotal(uint256 EventID)
		public
		view
		virtual
		returns (string[] memory)
	{
		string[] memory _SearchedStoreToken = new string[](10);

		uint256 _EventTokenSearchIds2 = 0;

		for (uint256 i = 0; i < _EventTokenIds; i++) {
			if (
				keccak256(bytes(AllEventTokens[i][0])) ==
				keccak256(bytes(Strings.toString(EventID)))
			) {
				_SearchedStoreToken[_EventTokenSearchIds2] = AllEventTokens[i][
					1
				];
				_EventTokenSearchIds2++;
			}
		}

		return _SearchedStoreToken;
	}

function getSearchEventbyWallet(string memory Wallet)
		public
		view
		virtual
		returns (string[] memory)
	{
	
		uint256 _TemporarySearch = 0;
		uint256 _SearchIds = 0;

		for (uint256 i = 0; i < _eventIds; i++) {
			if (
				keccak256(bytes(_eventURIs[i][0])) ==
				keccak256(bytes(Wallet))
			) {
				_TemporarySearch++;
			}
		}
		string[] memory _SearchedStoreEvents = new string[](_TemporarySearch);
		for (uint256 i = 0; i < _eventIds; i++) {
			if (
				keccak256(bytes(_eventURIs[i][0])) ==
				keccak256(bytes(Wallet))
			) {
				_SearchedStoreEvents[_SearchIds] = _eventURIs[i][1];
				_SearchIds++;
			}
		}


		return _SearchedStoreEvents;
	}

function getGetEventsTokenID(uint256 EventId, string memory _tokenURI)
		public
		view
		virtual
		returns (uint256)
	{
		for (uint256 i = 0; i < _EventTokenIds; i++) {
			if (
				keccak256(bytes(AllEventTokens[i][0])) ==
				keccak256(bytes(Strings.toString(EventId))) &&
				keccak256(bytes(AllEventTokens[i][1])) ==
				keccak256(bytes(_tokenURI))
			) {
				return i;
			}
		}

		return 0;
	}

function _getSearchedTokenURI(uint256 _tokenId)
		public
		view
		virtual
		returns (string memory)
	{
		return _SearchedStore[_tokenId][0];
	}

function _setEventURI(uint256 eventId,  string memory _eventWallet ,string memory _eventURI)
		public
		virtual
	{
		_eventURIs[eventId] = [
			_eventWallet,
			_eventURI
		];
		_eventRaised[eventId] = "0";
	}

function _setGrantEventURI(uint256 eventId, string memory _eventURI)
		public
		virtual
	{
		_GrantEventURIs[eventId] = _eventURI;
	}


function _setTokenURI(uint256 tokenId, string memory _tokenURI)
		public
		virtual
	{
		_tokenURIs[tokenId] = _tokenURI;
	}

function eventURI(uint256 eventId) public view returns (string[2] memory) {
		return _eventURIs[eventId];
	}

function tokenURI(uint256 tokenId)
		public
		view
		virtual
		returns (string memory)
	{

		return _tokenURIs[tokenId];
	}

function totalSupply() public view returns (uint256) {
		return _tokenIds;
	}

function totalEvent() public view returns (uint256) {
		return _eventIds;
	}

function totalGrantEvent() public view returns (uint256) {
		return _GrantProjectIds;
	}

function _setBidURI(uint256 bidId, string memory _bidURI) public virtual {
		_bidURIs[bidId] = _bidURI;
	}

function BidURI(uint256 BidId) public view returns (string memory) {
		return _bidURIs[BidId];
	}

function getTotalBid(uint256 TokenID)
		public
		view
		virtual
		returns (string[] memory)
	{
		string[] memory _SearchedStoreBid = new string[](10);

		uint256 _TokenBidSearchIds2 = 0;

		for (uint256 i = 0; i < _TokenBidIds; i++) {
			if (
				keccak256(bytes(AllTokensBids[i][0])) ==
				keccak256(bytes(Strings.toString(TokenID)))
			) {
				_SearchedStoreBid[_TokenBidSearchIds2] = AllTokensBids[i][1];
				_TokenBidSearchIds2++;
			}
		}

		return _SearchedStoreBid;
	}

function getBidsSearchToken(uint256 TokenID)
		public
		view
		virtual
		returns (string[] memory)
	{
		string[] memory _SearchedStoreBid = new string[](10);

		uint256 _TokenBidSearchIds2 = 0;

		for (uint256 i = 0; i < _TokenBidIds; i++) {
			if (
				keccak256(bytes(AllTokensBids[i][0])) ==
				keccak256(bytes(Strings.toString(TokenID)))
			) {
				_SearchedStoreBid[_TokenBidSearchIds2] = AllTokensBids[i][1];
				_TokenBidSearchIds2++;
			}
		}

		return _SearchedStoreBid;
	}

function _setTokenBid(
		uint256 TokenBidId,
		uint256 TokenId,
		string memory _BidURI
	) public virtual {
		AllTokensBids[TokenBidId] = [
			Strings.toString(TokenId),
			string(_BidURI)
		];
	}
 
function getEventRaised(uint256 _eventId)
		public
		view
		virtual
		returns (string memory)
	{
		return _eventRaised[_eventId];
	}

function _setEventRaised(uint256 _eventId, string memory _raised)
		public
	{
		_eventRaised[_eventId] = _raised;
	}

 function createBid(
		uint256 _tokenId,
		string memory _bidURI,
		string memory _updatedURI,
		uint256 _eventid,
		string memory _raised
	) public   {
		uint256 _EventTokenId = getGetEventsTokenID(
			_eventid,
			_tokenURIs[_tokenId]
		);
		_tokenURIs[_tokenId] = _updatedURI;
		_setTokenEvent(_EventTokenId, _eventid, _updatedURI);
		_setEventRaised(_eventid,_raised);

		_setTokenBid(_TokenBidIds, _tokenId, _bidURI);
		_TokenBidIds++;
		_bidIds++;
	}



    // Doante with a validator Address
    function donate(uint256 _event_id,uint256 _amount) public payable  {
        _approveRequiredMsgs();
        donated[_event_id] += _amount;
    }

    function stake(uint256 _amount) public {
        STAKING_CONTRACT.delegate(address(this), _validatorAddr, _amount);

    }

    function withdrawDonatedMoney(uint256 _event_id) public returns (int64) {      
        _approveRequiredMsgs();
        //Sotring Rewards to smart contract
        Coin[] memory newRewards = DISTRIBUTION_CONTRACT.withdrawDelegatorRewards(address(this), _validatorAddr);
     
        //Withdrawing just unbounding
        uint256 _amount = donated[_event_id];
        int64 completionTime = STAKING_CONTRACT.undelegate(address(this), _validatorAddr, _amount);
        //Saving undelegated amount into struct by event_id
        unbondingDelegations[_event_id] = UnbondingRequest(completionTime, unbondingDelegations[_event_id].amount + _amount);

        //Just withdrawing rewards now
        uint256 _rewards_amount = newRewards[0].amount;
        (bool sent,) = payable(msg.sender).call{value: _rewards_amount}("");     
        donated[_event_id] = 0;
        return  completionTime;
    }
   /// @dev approves the staking and distribution contracts for donating
    function _approveRequiredMsgs() public {
        bool successStk = STAKING_CONTRACT.approve(tx.origin,   type(uint256).max, stakingMethods);
        require(successStk, "Staking Approve failed");
        bool successDist = DISTRIBUTION_CONTRACT.approve(tx.origin, distributionMethods);
        require(successDist, "Distribution Approve failed");
    }

}


