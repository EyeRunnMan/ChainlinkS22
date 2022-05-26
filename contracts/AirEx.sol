// SPDX-License-Identifier: MIT

pragma solidity 0.8.11;

import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

// Polygon (Matic) Mumbai Testnet Deployment
contract AirEx is Context, AccessControlEnumerable, ReentrancyGuard, ERC721, ERC721Enumerable, VRFConsumerBaseV2 {

    using Strings for uint256;
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdTracker;
    
    VRFCoordinatorV2Interface COORDINATOR;
    
    // Your subscription ID.
    uint64 s_subscriptionId;

    // Mumbai coordinator. For other networks,
    // see https://docs.chain.link/docs/vrf-contracts/#configurations
    address vrfCoordinator = 0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed;

    // The gas lane to use, which specifies the maximum gas price to bump to.
    // For a list of available gas lanes on each network,
    // see https://docs.chain.link/docs/vrf-contracts/#configurations
    bytes32 s_keyHash = 0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f;

    // Depends on the number of requested values that you want sent to the
    // fulfillRandomWords() function. Storing each word costs about 20,000 gas,
    // so 40,000 is a safe default for this example contract. Test and adjust
    // this limit based on the network that you select, the size of the request,
    // and the processing of the callback request in the fulfillRandomWords()
    // function.
    uint32 callbackGasLimit = 40000;

    // The default is 3, but you can set this higher.
    uint16 requestConfirmations = 3;

    // For this example, retrieve 1 random value in one request.
    // Cannot exceed VRFCoordinatorV2.MAX_NUM_WORDS.
    uint32 numWords = 1;

    struct AIRExp {
        string name;
        string description;
        string imageLink;
        string accessLink;
    }

    struct AIRExpMetadata {
        string traitType;
        string traitValue;
        uint256 uniqueVal;
    }

    uint256 public cost = 0.05 ether;
    uint256 public maxSupply = 10000;
    bool public paused = false;

    mapping(uint256 => address) private buyer;
    mapping(address => uint256) private holder;
    mapping(uint256 => AIRExpMetadata) private requests;
    mapping(uint256 => AIRExpMetadata) private expTokens;
    mapping(uint256 => uint256) private uniqueReq;
    uint256 private constant REQUEST_IN_PROGRESS = 99999;

    AIRExp private airexData;

    string private md0 = 'data:application/json;base64,';
    string private md_name = '{"name": "';
    string private md_desc = '", "description": "';
    string private md_image = '", "image": "';
    string private md_access = '", "animation_url": "';
    string private md_attr_key = '", "attributes": [{"trait_type": "';
    string private md_attr_val = '","value": "';
    string private md_end = '"}]}';

    event AIRExRequested(uint256 indexed requestId, address indexed user);
    event AIRExFulfilled(uint256 indexed requestId, uint256 indexed uniqueParam);
    event AIRExRevealed(uint256 indexed tokenId, uint256 indexed uniqueParam);

    /**
     * Constructor 
     *
     */
    constructor(string memory name, string memory symbol, string memory description, string memory image, string memory accessLink, uint64 subscriptionId)
        VRFConsumerBaseV2(vrfCoordinator)
        ERC721(name, symbol)
    {
        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
        s_subscriptionId = subscriptionId;
        airexData.name = name;
        airexData.description = description;
        airexData.imageLink = image;
        airexData.accessLink = accessLink;
    }

    /**
     * Register Augmented Interactive Reality Experience
     */
    function requestAIREx(string memory _traitType, string memory _traitValue) public nonReentrant payable returns (uint256 requestId) {
        require(holder[_msgSender()] == 0, "AIREx: Already requested registration");
        requestId = COORDINATOR.requestRandomWords(
            s_keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
        buyer[requestId] = _msgSender();
        holder[_msgSender()] = REQUEST_IN_PROGRESS;
        requests[requestId] = AIRExpMetadata(_traitType, _traitValue, 0);
        emit AIRExRequested(requestId, _msgSender());
        return requestId;
    }

    /**
     * Reveals the Augmented Interactive Reality Experience by minting the NFT
     */
    function revealAIREx() public {
        require(holder[_msgSender()] != 0, "AIREx: Experience not requested");
        require(holder[_msgSender()] != REQUEST_IN_PROGRESS, "AIREx: Request under processing");
        uint256 uniqueParam = holder[_msgSender()];
        _tokenIdTracker.increment();
        uint256 currentTokenId = _tokenIdTracker.current();
        _safeMint(_msgSender(), currentTokenId);
        // setting metadata attributes for the tokenId 
        expTokens[currentTokenId] = requests[uniqueReq[uniqueParam]];
        expTokens[currentTokenId].uniqueVal = uniqueParam;
        holder[_msgSender()] = 0;
        emit AIRExRevealed(currentTokenId, uniqueParam);
    }

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "AIREx: Non-Existent Token");

        string memory jsonData = string(abi.encodePacked(md_name, airexData.name, md_desc, airexData.description, md_image, airexData.imageLink, md_access, airexData.accessLink));

        string memory params = string(abi.encodePacked("?uniqueParam=", uint256(expTokens[tokenId].uniqueVal).toString(),"?tokenId=", uint256(tokenId).toString()));

        // Generate token's metadataURI in json
        string memory _tokenURI = string(abi.encodePacked(md0, Base64.encode(bytes(string(abi.encodePacked(jsonData, params, getTraits(expTokens[tokenId]), md_end))))));
        return _tokenURI;
    }

    // get string attributes of properties, used in tokenURI call
    function getTraits(AIRExpMetadata memory airExpMetadata) internal view returns (string memory) {
        return string(abi.encodePacked(md_attr_key, airExpMetadata.traitType, md_attr_val, airExpMetadata.traitValue));
    }

    /**
     * Callback function used by VRF Coordinator to return the random number
     */
    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        uint256 uniqueParam = randomWords[0];
        holder[buyer[requestId]] = uniqueParam;
        uniqueReq[uniqueParam] = requestId;
        emit AIRExFulfilled(requestId, uniqueParam);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(AccessControlEnumerable, ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}