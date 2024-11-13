package com.backend.ecommerce.service;


import com.backend.ecommerce.model.*;
import com.backend.ecommerce.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private OrderItemRepository orderItemRepository;
    @Autowired
    private EmailService emailService;
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AddressRepository addressRepository;

    @Transactional
    public Order placeOrder(Long cartId, Address address) {
        // Find the cart with the given ID
        Optional<Cart> optionalCart = cartRepository.findById(cartId);
        if (!optionalCart.isPresent()) {
            throw new RuntimeException("Cart Not Found");
        }

        // Retrieve the cart and its items
        Cart cart = optionalCart.get();
        List<CartItem> cartItems = cart.getItems();

        // Save the user's address
        Address savedAddress = addressRepository.save(address);

        // Create a new order and set its properties
        Order order = new Order();
        order.setUser(cart.getUser());
        order.setOrderDate(LocalDate.now());
        order.setPayment(PaymentMethod.CASH_ON_DELIVERY);
        order.setAddress(savedAddress);
        orderRepository.save(order);

        // Create a list to hold the order items
        List<OrderItem> orderItems = new ArrayList<>();
        // Loop through the cart items and create a corresponding order item for each one
        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setOrder(order);
            orderItem.setOrderedProductPrice(orderItem.getProduct());
            orderItemRepository.save(orderItem); // Save the order item to the database
            orderItems.add(orderItem);
        }

        // Set the order's order items and total amount
        order.setOrderItems(orderItems);
        order.setTotalAmount(order.calculateTotalAmount());
        // Save the updated order to the database
        orderRepository.save(order);

        // Remove cart items and update the cart
        cart.clearItems();
        cartRepository.save(cart);
        // Return the newly created order
        return order;
    }


    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public void deleteOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Order not found with ID: " + id));

        orderItemRepository.deleteAll(order.getOrderItems());
        orderRepository.delete(order);
    }

    public void checkout(Integer userId, Long cartId, Address address) throws MessagingException {
        Order order = this.placeOrder(cartId, address);

        Optional<User> savedUser = userRepository.findById(userId);

        if (savedUser.isPresent()) {
            emailService.sendConfirmationEmail(order.getId(), savedUser.get().getEmail());
        } else {
            throw new IllegalArgumentException("Invalid user id: " + userId);
        }
    }


    public List<Order> getOrdersByUserId(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        List<Order> orders = orderRepository.findByUser(user);
        return orders;
    }

}



