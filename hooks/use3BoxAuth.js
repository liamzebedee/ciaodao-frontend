function use3BoxAuth(web3) {
    const text = 'This app wants to view and update your 3Box profile.'
    var msg = '0x' + Buffer.from(text, 'utf8').toString('hex')
    var params = [msg, fromAddress]
    // var method = 'personal_sign'
    
    try {
        let sig = await web3.eth.personal.sign(
            params, 
            fromAddress
        )
    } catch(ex) {
        return sig
    }
}

export { use3BoxAuth }