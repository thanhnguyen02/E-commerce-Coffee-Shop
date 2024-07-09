import React, { useEffect } from 'react';

const Thanksfor = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const vnp_Amount = params.get('vnp_Amount');
    const vnp_BankCode = params.get('vnp_BankCode');
    const vnp_BankTranNo = params.get('vnp_BankTranNo');
    const vnp_CardType = params.get('vnp_CardType');
    const vnp_OrderInfo = params.get('vnp_OrderInfo');
    const vnp_PayDate = params.get('vnp_PayDate');
    const vnp_TmnCode = params.get('vnp_TmnCode');
    const vnp_TransactionStatus = params.get('vnp_TransactionStatus');
    const vnp_TxnRef = params.get('vnp_TxnRef');
    const vnp_SecureHash = params.get('vnp_SecureHash');

    const data = {
      id_vnpay: Date.now(), // Hoặc giá trị id khác mà bạn muốn sử dụng
      vnp_Amount,
      vnp_BankCode,
      vnp_CardType,
      vnp_OrderInfo,
      vnp_PayDate,
      vnp_ResponseCode: params.get('vnp_ResponseCode'),
      vnp_TmnCode,
      vnp_TransactionNo: vnp_BankTranNo, // Nếu bạn muốn lưu trữ số giao dịch ngân hàng
      vnp_TransactionStatus,
      vnp_TxnRef,
      vnp_SecureHash,
    };

    fetch('http://localhost:5000/addvnpay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(vnpayData => {
      console.log('Success:', data);
      const shippingInfo = {
        email: localStorage.getItem('shippingEmail'),
        id_product: JSON.parse(localStorage.getItem('productId')),
        quantity: localStorage.getItem('quantity'),
        total: localStorage.getItem('total'),
        discount: localStorage.getItem('discount'),
        payment_id: vnpayData.id_vnpay,
        date: new Date(),
        number: localStorage.getItem('shippingPhone'),
        name: localStorage.getItem('shippingName'),
        distric: localStorage.getItem('shippingDistrict'),
        address: localStorage.getItem('shippingSpecificAddress'),
        status_pay: 1,  // assuming status_pay is 1 for paid
        status_bill: 'Đã thanh toán'
      };

      fetch('http://localhost:5000/addbill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shippingInfo),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Shipping info saved:', data);
      })
      .catch((error) => {
        console.error('Error saving shipping info:', error);
      });

    })
    .catch((error) => {
      console.error('Error:', error);
    });
}, []);

  return (
    <div>
      <h1 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', textAlign: 'center' }}>Cảm ơn bạn đã đặt hàng, vui lòng chú ý điện thoại khi Shipper gọi đến</h1>
      <a href="http://localhost:3000/" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '5vh', textAlign: 'center' }}>Tiếp tục mua hàng</a>
    </div>
  );
}

export default Thanksfor;
