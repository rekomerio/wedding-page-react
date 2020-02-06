import React from "react";
import { connect } from "react-redux";
import { Route, Redirect, Switch } from "react-router-dom";
import CreateBlog from "./CreateBlog";
import CreateGiftList from "./CreateGiftList";
import ReserveGift from "./ReserveGift";
import EditUser from "./EditUser";
import ConfirmComing from "./ConfirmComing";
import Users from "./Users";
import Guests from "./Guests";
import EditBlogPost from "./EditBlogPost";
import Homepage from "./Homepage";
import WishSong from "./WishSong";
import Songs from "./Songs";
import AuthorizedRoute from "./AuthorizedRoute";
import NotFound from "./NotFound";
import Blogs from "./Blogs";

const Routes = ({ user }) => (
    <Switch>
        <Route path="/welcome/:email/:password">
            <Redirect to="/user/confirm" />
        </Route>
        <Route exact path="/" component={Homepage} />
        <Route exact path="/blog" component={Blogs} />
        <Route path="/user/confirm" component={ConfirmComing} />
        <Route path="/giftlist/reserve" component={ReserveGift} />
        <Route path="/songs/wish" component={WishSong} />
        <AuthorizedRoute path="/songs/all" authorized={user.isAdmin} component={Songs} />
        <AuthorizedRoute
            path="/blog/create"
            authorized={user.isAdmin}
            component={CreateBlog}
        />
        <AuthorizedRoute
            path="/blog/edit/:id"
            authorized={user.isAdmin}
            component={EditBlogPost}
        />
        <AuthorizedRoute
            path="/giftlist/create"
            authorized={user.isAdmin}
            component={CreateGiftList}
        />
        <AuthorizedRoute
            path="/user/:id/edit"
            authorized={user.isAdmin}
            component={EditUser}
        />
        <AuthorizedRoute path="/users" authorized={user.isAdmin} component={Users} />
        <AuthorizedRoute path="/guests" authorized={user.isAdmin} component={Guests} />
        <Route>
            <NotFound />
        </Route>
    </Switch>
);

const mapStateToProps = state => ({ user: state.user });

export default connect(mapStateToProps)(Routes);
