import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import LoginContainer from './LoginContainer';

function mapStateToProps() {
    return {

    }
}

function mapDispatchToProps() {
    return {

    }
}

const LoginPage = connect(mapStateToProps,mapDispatchToProps)(LoginContainer);

export default LoginPage;