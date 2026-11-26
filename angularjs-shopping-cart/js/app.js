
var app = angular.module('shoppingApp', []);
const API_URL = "http://localhost:8080/api/orders";

app.controller('ShoppingController', function ($scope, $http) {

    // Product listing
    $scope.products = [
        {
            id: 1,
            name: 'Wireless Headphones',
            description: 'Bluetooth headphones',
            price: 120,
            imageId: 1
        },
        {
            id: 2,
            name: 'Mechanical Keyboard',
            description: 'RGB gaming keyboard',
            price: 180,
            imageId: 2
        },
        {
            id: 3,
            name: 'Gaming Mouse',
            description: 'Wireless gaming mouse',
            price: 85,
            imageId: 3
        },
        {
            id: 4,
            name: 'Monitor',
            description: '27 inch LED monitor',
            price: 650,
            imageId: 4
        }
    ];

    // Shopping cart
    $scope.cart = [];

    // Add product to cart
    $scope.addToCart = function (product) {

        var existingItem = $scope.cart.find(function (item) {
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
    $scope.increaseQty = function (item) {
        item.quantity++;
    };

    // Decrease quantity
    $scope.decreaseQty = function (item) {

        if (item.quantity > 1) {
            item.quantity--;
        }

    };

    // Remove product
    $scope.removeItem = function (item) {

        var index = $scope.cart.indexOf(item);

        if (index !== -1) {
            $scope.cart.splice(index, 1);
        }

    };

    // Calculate total quantity
    $scope.getTotalItems = function () {

        var total = 0;

        angular.forEach($scope.cart, function (item) {
            total += item.quantity;
        });

        return total;
    };

    // Calculate total price
    $scope.getTotalPrice = function () {

        var total = 0;

        angular.forEach($scope.cart, function (item) {
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

    //// CRUD images
    // Variables
    $scope.selectedProduct = null;
    $scope.selectedFile = null;
    $scope.previewImage = null;

    // Edit Image
    $scope.editImage = function (product) {

        $scope.selectedProduct = product;
        $scope.selectedFile = null;

        $scope.previewImage =
            "http://localhost:8080/api/images/" + product.imageId;

    };


    // Select Image
    $scope.selectImage = function (input) {

        var file = input.files[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            alert("Please select an image file.");
            input.value = "";
            return;
        }

        $scope.selectedFile = file;

        var reader = new FileReader();

        reader.onload = function (e) {

            $scope.$apply(function () {
                $scope.previewImage = e.target.result;
            });

        };

        reader.readAsDataURL(file);

    };


    // Save Image
    $scope.saveImage = function () {

        if (!$scope.selectedFile) {
            alert("Please select a new image.");
            return;
        }

        var formData = new FormData();

        formData.append("file", $scope.selectedFile);

        var imageId = $scope.selectedProduct.imageId;

        $http.put(
            "http://localhost:8080/api/images/" + imageId,
            formData,
            {
                transformRequest: angular.identity,
                headers: {
                    "Content-Type": undefined
                }
            }
        ).then(function (response) {

            alert("Image updated successfully!");

            // Refresh image
            $scope.previewImage =
                "http://localhost:8080/api/images/"
                + imageId + "?t=" + Date.now();

            $scope.selectedProduct = null;
            $scope.selectedFile = null;

            document.getElementById("imageFile").value = "";

            window.location.reload();

        }, function (error) {

            alert("Failed to update image!");

            console.error(error);

        });

    };


    // Cancel Edit
    $scope.cancelEdit = function () {

        $scope.selectedProduct = null;
        $scope.selectedFile = null;
        $scope.previewImage = null;

        document.getElementById("imageFile").value = "";

    };

    // Add image
    $scope.newImage = {
        fileName: ""
    };

    $scope.newImageFile = null;
    $scope.newImagePreview = null;

    // Select image
    $scope.selectNewImage = function (input) {
        var file = input.files[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            alert("Please select an image file.");
            input.value = "";
            return;
        }

        $scope.$apply(function () {
            $scope.newImageFile = file;
            $scope.newImagePreview = URL.createObjectURL(file);
        });
    };

    // Upload image using HTTP POST
    $scope.uploadImage = function () {

        if (!$scope.newImageFile) {
            alert("Please select an image.");
            return;
        }

        var formData = new FormData();

        formData.append("file", $scope.newImageFile);
        formData.append("fileName", $scope.newImage.fileName);

        $http.post(
            "http://localhost:8080/api/images",
            formData,
            {
                transformRequest: angular.identity,
                headers: {
                    "Content-Type": undefined
                }
            }
        ).then(function (response) {

            alert("Image uploaded successfully!");

            console.log(response.data);

            $scope.newImage = {
                fileName: ""
            };

            $scope.newImageFile = null;
            $scope.newImagePreview = null;

            document.getElementById("newImageFile").value = "";

            window.location.reload();

        }, function (error) {

            alert("Failed to upload image!");
            console.error(error);

        });
    };

    // auto refresh
    $scope.loadImages = function () {
        $http.get("http://localhost:8080/api/images")
            .then(function (response) {
                $scope.images = response.data;
            })
            .catch(function (error) {
                console.error("Failed to load images", error);
            });
    };

});
