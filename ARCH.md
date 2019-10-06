Dapp data architecture
======================

This app is built using Redux and React, meaning there is a one-way flow of data. It also uses Redux Saga's for a more declarative, effect-driven approach to the UI development. 

Data is cached locally using `localStorage`. 

users {
    ethAddress
    box3Id
}

Post {
    content
    author: User
    timestamp
}

Space {
    name: string
    ethAddress: string
    chainId: string
    members: []User
    posts: []Post
}


### Loading a space
The primary key of a space is its Ethereum address. We store the chainId along with every space for convenience.

 1. Load space name
 2. Load messages
    1. Load 3Box profile
    2. Load eth address from 3Box profile
    3. Call `Space.isMember(ethAddress)` to verify membership