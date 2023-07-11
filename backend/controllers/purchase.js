const Razorpay = require("razorpay");
const Order = require("../models/order");

exports.purchasePremium = async (req, res, next) => {
  try {
    var rzp = new Razorpay({
      key_id: "rzp_test_cpzxN1rwK7mEIy",
      key_secret: "1iY56NglIoyneMe7wdfykRJw",
    });
    const amount = 2500;

    rzp.orders.create(
      {
        amount,
        currency: "INR",
      },
      (err, order) => {
        if (err) {
          throw new Error(JSON.stringify(err));
        }
        req.user
          .createOrder({
            orderId: order.id,
            status: "PENDING",
          })
          .then(() => {
            return res.status(201).json({ order, key_id: rzp.key_id });
          })
          .catch((err) => {
            throw new Error(err);
          });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(403).json({
      message: "Something went wrong",
      error: err,
    });
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { payment_id, order_id, success } = req.body;
    if (success) {
      const [order] = await Promise.all([
        Order.findOne({ where: { orderId: order_id } }),
        req.user.update({ isPremium: true }),
      ]);
      // const order = await Order.findOne({ where: { orderId: order_id } });
      // await req.user.update({ isPremium: true });
      await order.update({ paymentId: payment_id, status: "SUCCESSFUL" });
      return res.status(202).json({
        success: true,
        message: "Transaction Successful",
      });
    } else {
      const order = await Order.findOne({ where: { orderId: order_id } });
      await order.update({ status: "FAILED" });
      return res.status(404).json({
        success: false,
        message: "Transaction Failed",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({
      success: false,
      message: err,
    });
  }
};
