import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';

const CartTotal = ({total}) => {

  const {currency,delivery_fee,getCartAmount} = useContext(ShopContext);

  return (
    <div className='w-full'>
      <div className='text-2xl'>
        <Title text1={'CART'} text2={'TOTALS'} />
      </div>

      <div className='flex flex-col gap-2 mt-2 text-sm'>
            {/* <div className='flex justify-between'>
                <p>Subtotal</p>
                <p>{Intl.NumberFormat().format(getCartAmount())} {currency}</p>
            </div>
            <hr />
            <div className='flex justify-between'>
                <p>Shipping Fee</p>
                <p>{Intl.NumberFormat().format(delivery_fee)} {currency}</p>
            </div>
            <hr /> */}
            <div className='flex justify-between'>
                <b>Total</b>
                <b>{total}</b>
            </div>
      </div>
    </div>
  )
}

export default CartTotal
