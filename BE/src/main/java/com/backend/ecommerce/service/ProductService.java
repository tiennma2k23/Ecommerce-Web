package com.backend.ecommerce.service;


import com.backend.ecommerce.model.Category;
import com.backend.ecommerce.model.Product;
import com.backend.ecommerce.repository.CategoryRepository;
import com.backend.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProductService {
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();

    }
    public Product getProduct(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid product id: " + id));
    }
    public Product addProduct(Product product, Long categoryId) {
        return categoryRepository.findById(categoryId)
                .map(category -> {
                    product.setCategory(category);
                    return productRepository.save(product);
                })
                .orElseThrow(() -> new IllegalArgumentException("Invalid category id: " + categoryId));
    }
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
    public List<Product> searchProductsByName(String query) {
        return productRepository.findByNameContainingIgnoreCase(query);
    }
    public List<Product> searchProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    public Product updateProduct(Product product, long categoryId) {
        Product existingProduct = productRepository.findById(product.getId()).orElse(null);
        if (existingProduct != null) {
            existingProduct.setName(product.getName());
            existingProduct.setDescription(product.getDescription());
            existingProduct.setPrice(product.getPrice());

            Category category = categoryRepository.findById(categoryId).orElse(null);
            if (category != null) {
                existingProduct.setCategory(category);
            }

            productRepository.save(existingProduct);
        }
        return existingProduct;
    }
    public List<Product> getRelatedProducts(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid product id: " + productId));

        List<Product> relatedProducts = new ArrayList<>();

        if (product.getCategory() != null) {
            List<Product> productsInCategory = productRepository.findByCategoryId(product.getCategory().getId());
            for (Product p : productsInCategory) {
                if (!p.getId().equals(productId)) {
                    relatedProducts.add(p);
                }
                if (relatedProducts.size() == 5) {
                    break;
                }
            }
        }

        return relatedProducts;
    }

}
