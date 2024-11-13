package com.backend.ecommerce.service;

import com.backend.ecommerce.model.Cart;
import com.backend.ecommerce.model.CartItem;
import com.backend.ecommerce.model.Product;
import com.backend.ecommerce.model.User;
import com.backend.ecommerce.repository.CartItemRepository;
import com.backend.ecommerce.repository.CartRepository;
import com.backend.ecommerce.repository.ProductRepository;
import com.backend.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {
    @Autowired
    private final CartRepository cartRepository;
    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private CartItemRepository cartItemRepository;

    public CartService(CartRepository cartRepository, UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
    }

    public Cart createCart(Integer userId) {
        Optional<User> existingUser = userRepository.findById(userId);
        Cart cart = new Cart();
        cart.setUser(existingUser.orElseThrow(() -> new RuntimeException("User not found")));
        return cartRepository.save(cart);
    }

    public Cart getCartById(Long cartId) {
        return cartRepository.findById(cartId).orElseThrow(() -> new RuntimeException("Cart not found"));
    }

    public List<CartItem> getCartItems(Cart cart) {
        return cart.getItems();
    }

    public String addCartItem(long cartId, Long productId, int quantity) {
        Optional<Cart> optionalCart = cartRepository.findById(cartId);
        Optional<Product> optionalProduct = productRepository.findById(productId);

        if (optionalCart.isPresent() && optionalProduct.isPresent()) {
            Cart cart = optionalCart.get();
            List<CartItem> cartItems = cart.getItems();

            Optional<CartItem> optionalCartItem = cartItems.stream()
                    .filter(item -> item.getProduct().getId().equals(productId))
                    .findFirst();

            if (optionalCartItem.isPresent()) {
                CartItem cartItem = optionalCartItem.get();
                cartItem.setQuantity(cartItem.getQuantity() + quantity);
                cartRepository.save(cart);
                return "Item quantity updated";
            } else {
                CartItem newCartItem = new CartItem();
                newCartItem.setProduct(optionalProduct.get());
                newCartItem.setQuantity(quantity);
                newCartItem.setCart(cart);
                cartItems.add(newCartItem);
                cartRepository.save(cart);
                return "Item added to cart";
            }
        } else {
             throw new RuntimeException("Invalid Product or Cart ID");
        }
    }
@Transactional
    public void removeCartItem(Long cartId, Long cartItemId) {
        try {
            Optional<Cart> savedCart = cartRepository.findById(cartId);
            Optional<CartItem> savedCartItem = cartItemRepository.findById(cartItemId);
            if (savedCart.isPresent() && savedCartItem.isPresent()) {
                List<CartItem> cartItems = savedCart.get().getItems();
                cartItems.remove(savedCartItem.get());

                cartRepository.save(savedCart.get());
            }

        } catch (Exception exception) {

            throw new RuntimeException("cart item or cart not found");
        }
    }
@Transactional
    public void clearCart(Long cartId) {
        Optional<Cart> optionalCart = cartRepository.findById(cartId);
        if (optionalCart.isPresent()) {
            Cart cart = optionalCart.get();
            List<CartItem> cartItems = cart.getItems();
            cartItems.clear();
            cartRepository.save(cart);
        }
    }

    public Cart getCart(int userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> createCart(userId));
    }

}
