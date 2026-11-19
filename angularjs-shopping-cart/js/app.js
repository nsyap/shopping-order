
var app = angular.module('shoppingApp', []);
const API_URL = "http://localhost:8080/api/orders";

app.controller('ShoppingController', function($scope, $http) {

    // Product listing
    $scope.products = [
        {
            id: 1,
            name: 'Wireless Headphones',
            description: 'Bluetooth headphones',
            price: 120
        },
        {
            id: 2,
            name: 'Mechanical Keyboard',
            description: 'RGB gaming keyboard',
            price: 180
        },
        {
            id: 3,
            name: 'Gaming Mouse',
            description: 'Wireless gaming mouse',
            price: 85
        },
        {
            id: 4,
            name: 'Monitor',
            description: '27 inch LED monitor',
            price: 650
        }
    ];

    // Shopping cart
    $scope.cart = [];

    // Add product to cart
    $scope.addToCart = function(product) {

        var existingItem = $scope.cart.find(function(item) {
            return item.id === product.id;
        });

        if (existingItem) {
            existingItem.quantity++;
        } else {
            $scope.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1
            });
        }

    };

    // Increase quantity
    $scope.increaseQty = function(item) {
        item.quantity++;
    };

    // Decrease quantity
    $scope.decreaseQty = function(item) {

        if (item.quantity > 1) {
            item.quantity--;
        }

    };

    // Remove product
    $scope.removeItem = function(item) {

        var index = $scope.cart.indexOf(item);

        if (index !== -1) {
            $scope.cart.splice(index, 1);
        }

    };

    // Calculate total quantity
    $scope.getTotalItems = function() {

        var total = 0;

        angular.forEach($scope.cart, function(item) {
            total += item.quantity;
        });

        return total;
    };

    // Calculate total price
    $scope.getTotalPrice = function() {

        var total = 0;

        angular.forEach($scope.cart, function(item) {
            total += item.price * item.quantity;
        });

        return total;
    };

    // Checkout
    $scope.checkout = function () {

        alert(
            'Order Total: RM ' +
            $scope.getTotalPrice().toFixed(2)
        );

        var orderData = {
            items: $scope.cart,
            total: $scope.total
        };

        $http.post(API_URL, orderData, {
          responseType: "text",
          transformResponse: function (data) {
          return data;
          }
        })
        .then(function (response) {

            alert(response.data);
           //example: 
           // Order processed successfully: 
           // {"items":[{"id":4,"name":"Monitor","price":650,"quantity":1}]}
        })
        .catch(function (error) {

            console.error(error);

            alert("Unable to submit order.");
        });
    };

});
