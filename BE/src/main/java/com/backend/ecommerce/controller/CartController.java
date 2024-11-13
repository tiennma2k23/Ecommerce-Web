package com.backend.ecommerce.controller;


import com.backend.ecommerce.model.Cart;
import com.backend.ecommerce.model.CartItem;
import com.backend.ecommerce.model.Product;
import com.backend.ecommerce.repository.CartItemRepository;
import com.backend.ecommerce.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/cart")
public class CartController {
    @Autowired
    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/create")
    public ResponseEntity<Cart> createCart(@RequestParam Integer user_id) {
        Cart cart = cartService.createCart(user_id);
        return ResponseEntity.ok(cart);
    }

    @GetMapping("/get")
    public ResponseEntity<Cart> getCartById(@RequestParam Long id) {
        Cart cart = cartService.getCartById(id);
        if (cart == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(cart);
    }

    @GetMapping("/get/items")
    public ResponseEntity<List<CartItem>> getCartItems(@RequestParam Long cartId) {
        Cart cart = cartService.getCartById(cartId);
        if (cart == null) {
            return ResponseEntity.notFound().build();
        }
        List<CartItem> cartItems = cartService.getCartItems(cart);
        return ResponseEntity.ok(cartItems);
    }

    @PostMapping("/add/items")
    public ResponseEntity<String> addCartItem(@RequestParam Long cartId, @RequestParam long productId, @RequestParam int quantity) {
        cartService.addCartItem(cartId,productId, quantity);
        return ResponseEntity.ok("Item added to cart");
    }

    @DeleteMapping("/remove/items")
    public ResponseEntity<?> removeCartItem(@RequestParam Long cartId, @RequestParam Long itemId) {
        cartService.removeCartItem(cartId,itemId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(@RequestParam Long id) {
        Cart cart = cartService.getCartById(id);
        if (cart == null) {
            return ResponseEntity.notFound().build();
        }
        cartService.clearCart(id);
        return ResponseEntity.ok().build();
    }
}
