import { login, register, getMe } from "../service/auth.api";
import { setUser, setError, setLoading } from "../state/auth.slice";
import { useDispatch } from "react-redux";

export const useAuth = () => {
  const dispatch = useDispatch();

  async function handleRegister({
    email,
    contact,
    password,
    fullname,
    isSeller = false,
  }) {
    try {
      dispatch(setLoading(true));
      const data = await register({
        email,
        contact,
        password,
        fullname,
        isSeller,
      });
      dispatch(setUser(data.user));
      dispatch(setError(null));
      return data;
    }
    catch (err) {
      dispatch(setError(err.response?.data?.message || err.message));
      throw err;
    }
    finally {
      dispatch(setLoading(false));
    }
  }

  async function handleLogin({ email, password }) {
    try {
      dispatch(setLoading(true));
      const data = await login({ email, password });
      dispatch(setUser(data.user));
      dispatch(setError(null));
      return data;
    }
    catch (err) {
      dispatch(setError(err.response?.data?.message || err.message));
      throw err;
    }
    finally {
      dispatch(setLoading(false));
    }
  }



  async function handleGetMe() {
    try {
      dispatch(setLoading(true))
      const data = await getMe()
      dispatch(setUser(data.user))
    }
    catch (err) {
      console.log(err)
    }
    finally {
      dispatch(setLoading(false))
    }
  }

  return { handleRegister, handleLogin, handleGetMe }

}
