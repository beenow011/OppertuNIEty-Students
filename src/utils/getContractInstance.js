// const { ethers } = require("ethers");
// const contractAbi = require("../contracts/contractAbi.json");
import { ethers } from "ethers";
import contractAbi from "../constants/contractAbi.json";
import contractNFTAbi from "../constants/contractNFTAbi.json";

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
export const getNFTContractInstance = async () => {

    // 0x6Cb2344EcF5687fd04f812739251819B5335dB24
    try {
        const contractAddress = "0x5b8Da09967fcDCA5eE3cdCF17A30404dA7De9084"
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contractInstance = new ethers.Contract(contractAddress, contractNFTAbi, signer);

        return contractInstance;
    } catch (err) {
        console.error(err);
        throw new Error(err.message);
    }
}
