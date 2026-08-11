package com.deepak.grocery_delivery.serviceimpl;

import com.deepak.grocery_delivery.dto.cart.AddToCartRequest;
import com.deepak.grocery_delivery.dto.cart.CartItemResponse;
import com.deepak.grocery_delivery.dto.cart.CartResponse;
import com.deepak.grocery_delivery.dto.cart.UpdateCartItemRequest;
import com.deepak.grocery_delivery.entity.Cart;
import com.deepak.grocery_delivery.entity.CartItem;
import com.deepak.grocery_delivery.entity.Product;
import com.deepak.grocery_delivery.entity.User;
import com.deepak.grocery_delivery.repository.CartItemRepository;
import com.deepak.grocery_delivery.repository.CartRepository;
import com.deepak.grocery_delivery.repository.ProductRepository;
import com.deepak.grocery_delivery.repository.UserRepository;
import com.deepak.grocery_delivery.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;


    @Override
    public CartResponse addToCart(
            String email,
            AddToCartRequest request) {

        // 1. Find logged-in user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // 2. Validate quantity
        if (request.getQuantity() == null ||
                request.getQuantity() <= 0) {

            throw new RuntimeException(
                    "Quantity must be greater than zero");
        }

        // 3. Find product
        Product product = productRepository
                .findByIdAndActiveTrue(request.getProductId())
                .orElseThrow(() ->
                        new RuntimeException("Product not found"));

        // 4. Check stock
        if (product.getStockQuantity()
                < request.getQuantity()) {

            throw new RuntimeException(
                    "Insufficient stock");
        }

        // 5. Find user's cart or create one
        Cart cart = cartRepository.findByUser(user)
                .orElseGet(() -> {

                    Cart newCart = Cart.builder()
                            .user(user)
                            .items(new ArrayList<>())
                            .build();

                    return cartRepository.save(newCart);
                });

        // 6. Check whether product already exists
        //    in the cart
        CartItem cartItem =
                cartItemRepository
                        .findByCartAndProduct(cart, product)
                        .orElse(null);

        if (cartItem != null) {

            int newQuantity =
                    cartItem.getQuantity()
                            + request.getQuantity();

            // Check stock again
            if (newQuantity >
                    product.getStockQuantity()) {

                throw new RuntimeException(
                        "Insufficient stock");
            }

            cartItem.setQuantity(newQuantity);

        } else {

            cartItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .build();
        }

        cartItemRepository.save(cartItem);

        // 7. Return updated cart
        return buildCartResponse(cart);
    }


    private CartResponse buildCartResponse(Cart cart) {

        List<CartItemResponse> items =

                cartItemRepository.findByCart(cart)
                        .stream()
                        .filter(item ->
                                item.getCart()
                                        .getId()
                                        .equals(cart.getId()))
                        .map(this::mapToCartItemResponse)
                        .toList();

        BigDecimal totalAmount = items.stream()
                .map(CartItemResponse::getSubtotal)
                .reduce(
                        BigDecimal.ZERO,
                        BigDecimal::add
                );

        return CartResponse.builder()
                .cartId(cart.getId())
                .items(items)
                .totalAmount(totalAmount)
                .build();
    }


    private CartItemResponse mapToCartItemResponse(
            CartItem cartItem) {

        Product product = cartItem.getProduct();

        BigDecimal subtotal =
                product.getPrice()
                        .multiply(
                                BigDecimal.valueOf(
                                        cartItem.getQuantity()
                                )
                        );

        return CartItemResponse.builder()
                .id(cartItem.getId())
                .productId(product.getId())
                .productName(product.getName())
                .imageUrl(product.getImageUrl())
                .price(product.getPrice())
                .quantity(cartItem.getQuantity())
                .subtotal(subtotal)
                .build();
    }


    @Override
    public CartResponse getCart(String email) {

        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Email does not exist"));


        Cart cart =  cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("User not found"));


        return buildCartResponse(cart);




    }


    @Override
    public CartResponse updateCartItem(
            String email,
            Long cartItemId,
            UpdateCartItemRequest request) {


        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Email does not exist"));


        if(request.getQuantity() == null || request.getQuantity() <= 0) {

            throw new RuntimeException("Quantity must be greater than zero");

        }

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));


        CartItem cartItem = cartItemRepository.findById(cartItemId).orElseThrow(()-> new RuntimeException("Item not found"));


        if(!cartItem.getCart()
                .getId()
                .equals(cart.getId())) {
            throw new RuntimeException("Cart item does not belong to this user");
        }

        Product product = cartItem.getProduct();

        if(request.getQuantity() > product.getStockQuantity()) {

            throw new RuntimeException("Insufficient stock");

        }

        cartItem.setQuantity(request.getQuantity());

        cartItemRepository.save(cartItem);

        return buildCartResponse(cart);


    }


    @Override
    public void removeCartItem(
            String email,
            Long cartItemId) {


        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Email does not exist"));

        Cart cart = cartRepository.findByUser(user).orElseThrow(() -> new RuntimeException("Cart not found"));

        CartItem cartItem = cartItemRepository.findById(cartItemId).orElseThrow(()-> new RuntimeException("Item not found"));


        if (!cartItem.getCart()
                .getId()
                .equals(cart.getId())) {

            throw new RuntimeException(
                    "Cart item does not belong to this user");
        }

        cartItemRepository.delete(cartItem);



    }


    @Override
    public void clearCart(String email) {

        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Email does not exist"));

        Cart cart =  cartRepository.findByUser(user).orElseThrow(() -> new RuntimeException("Cart not found"));


        cartItemRepository.deleteByCart(cart);

//        cartItemRepository.deleteAll(
//                cartItemRepository.findAll()
//                        .stream()
//                        .filter(item ->
//                                item.getCart().getId().equals(cart.getId()))
//                        .toList()
//        );


    }
}