import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import PrivateRoute from "./components/Miscellaneous/PrivateRoute";
import AuthProvider from "./contexts/Auth";
import ProductProvider from "./contexts/Product";
import OrderProvider from "./contexts/Order";
import Home from "./components/Home/Home";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import ProductById from "./components/Products/ProductById";
import AddProduct from "./components/Products/AddProduct";
import UpdateProduct from "./components/Products/UpdateProduct";
import Cart from "./components/Cart/Cart";
import Search from "./components/Search/Search";
import Profile from "./components/Profile/Profile";
import Shipping from "./components/Cart/Shipping";
import Payment from "./components/Cart/Payment";
import ConfirmOrder from "./components/Cart/ConfirmOrder";
import OrderById from "./components/Orders/OrderById";
import NotFound from "./components/Miscellaneous/NotFound";

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProductProvider>
          <OrderProvider>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/signup" component={Signup} />
              <Route path="/login" component={Login} />
              <Route path="/cart" component={Cart} />
              <Route path="/search/:searchTerm" component={Search} />
              <Route path="/product/:productId" component={ProductById} />
              <PrivateRoute path="/products/new" component={AddProduct} />
              <PrivateRoute path="/products/update" component={UpdateProduct} />
              <PrivateRoute path="/profile" component={Profile} />
              <PrivateRoute path="/shipping" component={Shipping} />
              <PrivateRoute path="/payment" component={Payment} />
              <PrivateRoute path="/confirmOrder" component={ConfirmOrder} />
              <PrivateRoute path="/order/:orderId" component={OrderById} />
              <Route path="*" component={NotFound} />
            </Switch>
          </OrderProvider>
        </ProductProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
