export function profileName(profile, did) {
    return (profile && profile.name) || `Unknown #${did.slice(-6)}`
}

export function toEtherscanLink({ address, token, txHash }) {
    if(address) {
        return `https://rinkeby.etherscan.io/address/${address}`
    } else if(txHash) {
        return `https://rinkeby.etherscan.io/tx/${txHash}`
    } else if(token) {
        return `https://rinkeby.etherscan.io/token/${token}`
    }
}