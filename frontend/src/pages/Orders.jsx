import React from 'react'

const Orders = () => {
  return (
    <div>
      <h1 className='text-2xl font-atemica justify-start p-10'>Orders</h1>
      <div className='flex flex-col w-1/2 md:mx-auto mx-5 justify-center bg-accent border-3 p-7 gap-5 rounded-lg hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[4px] hover:-translate-y-[4px] transition-all duration-300'>
        <div className=''>Order ID</div>
        <div className=''>Order Date</div>
        <div className=''>Order Status</div>
        <div className=''>Order Total</div>
        
      </div>

      <div>
        <h2>Order Status</h2>
        <div>
          <div>
            <h3>Order ID</h3>
            
          </div>
          <div>
            <h3>Order Date</h3>
            <p>Order Date</p>
          </div>
          <div>
            <h3>Pick Up Order</h3>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Orders