import React from 'react';

import styled from 'styled-components'

import Humanize from 'humanize-plus'

let items = [
    {
        name: 'Newling',
        preview: {
            image: 'https://i.giphy.com/media/mCRJDo24UvJMA/giphy.webp'
        },
        type: 'Badge',
        price: {
            amount: 0,
            coin: 'dog'
        },
    },
    {
        name: 'Developer',
        preview: {
            image: 'https://media.giphy.com/media/MGdfeiKtEiEPS/giphy.webp'
        },
        type: 'Badge',
        price: {
            amount: 100,
            coin: 'dog'
        }
    },
    {
        name: 'Hacker',
        preview: {
            image: 'https://media.giphy.com/media/Z543HuFdQAmkg/giphy.webp'
        },
        type: 'Badge',
        price: {
            amount: 13770,
            coin: 'dog'
        }
    }
]

// https://coolors.co/9e9697-ddbdd5-ac9fbb-59656f-98989f

const Item = (item, locked) => {
    const Style = styled.div`
    width: 200px;
    height: 300px;
    border: 1px solid #464652;
    
    margin: 15px;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-items: center;
    border-radius: 10px;
    overflow: hidden;

    &:hover {
        cursor: pointer;
        .preview {
            background: #f5f5f5;
        }
    }

    .preview {
        width: 100%;
        display: flex;
        flex-direction: column;
        flex: 1;
        justify-content: center;
        align-items: center;

        .image {
            width: 100%;
            height: 100%;
            max-height: 160px;
            max-width: 160px;
            box-shadow: 5px 5px #f3f3f3;
            border-radius: 48%;
        }
        .locked {
            height: 100%;
            max-height: 140px;
        }
    }

    

    .item-details {
        display: flex;
        flex-direction: column;
        
        background: #464652;
        width: 100%;
        
        text-align: center;
        padding: 10px 0;
        .name {
            color: #eee;
            text-transform: uppercase;
            font-size: 24px;
            font-weight: bold;
            padding-bottom: 5px;
        }
        .type {
            color: #9E9697;
            margin-bottom: 0;
            font-size: 16px;
        }
    }

    .price-details {
        display: flex;
        flex-direction: column;
        padding: 5px 0;
        font-weight: 700;
        font-family: 'Source Code Pro';
        
        align-content: end;
        color: #F7EBEC;
        background: #1D1E2C;
        width: 100%;
    }

    .price-details > * {
        margin: 5px 0px;
        text-align: center;
    }
    `

    return <Style>
        <div class='preview'>
            { 
            item.locked 
            ? <img className='locked' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiyNvRr4QgNdisUt2jbQb72fZwoB8r7ecGwmcIJvkoY3G_Gqln&s"/>
            : <img className='image' src={item.preview.image}/> 
            }
        </div>
        
        <div className='item-details'>
            <span className='name'>{item.name}</span>
            <span className='type'>{item.type}</span>
        </div>

        <div className='price-details'>
            <span>
                { 
                item.locked 
                ? <span>Locked</span>
                : <><span className='amount'>{ Humanize.intComma(item.price.amount) }</span> <span className='coin'>{ item.price.coin.toUpperCase() }</span></>
                }
                
            </span>
        </div>
    </Style>
}

const TheStore = () => {
    const Style = styled.div`
    
    `
    return <Style>


        {
            items.map(item => <Item {...item}/>)
        }

        <Item {...items[0]} locked={true}/>
        <Item {...items[0]} locked={false}/>
    </Style>
}



/**
 * This item is unavailable to you.
 * 
 * Manager position.
 * 
 * You need:
 * - Developer
 * ~~~~500 DAI~~~~~
 */

/**
 * Your inventory:
 * 
 * 
 */

export { TheStore }