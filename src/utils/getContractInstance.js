// const { ethers } = require("ethers");
// const contractAbi = require("../contracts/contractAbi.json");
import { ethers } from "ethers";
import contractAbi from "../constants/contractAbi.json";

export const getContractInstance = async () => {
    try {

        const contractAddress = "0xBE619fD3D415a5cEbd817014BAABdbBed0C688e2"
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);

        return contractInstance;
    } catch (err) {
        console.error(err);
        throw new Error(err.message);
    }


}

