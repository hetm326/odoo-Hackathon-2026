import { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser, signupUser, logout } from '../redux/slices/authSlice';
import { fetchTrips, setSelectedTrip, createNewTrip, deleteTripById } from '../redux/slices/tripSlice';

// 1. useAuth Hook
export const useAuth = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const login = (credentials) => dispatch(loginUser(credentials)).unwrap();
  const signup = (userData) => dispatch(signupUser(userData)).unwrap();
  const handleLogout = () => dispatch(logout());

  return {
    ...authState,
    login,
    signup,
    logout: handleLogout,
  };
};

// 2. useTrip Hook
export const useTrip = () => {
  const dispatch = useDispatch();
  const tripState = useSelector((state) => state.trips);

  useEffect(() => {
    if (tripState.trips.length === 0 && !tripState.loading) {
      dispatch(fetchTrips());
    }
  }, [dispatch, tripState.trips.length, tripState.loading]);

  const selectTrip = (id) => dispatch(setSelectedTrip(id));
  const createTrip = (tripData) => dispatch(createNewTrip(tripData));
  const deleteTrip = (id) => dispatch(deleteTripById(id));

  return {
    ...tripState,
    selectTrip,
    createTrip,
    deleteTrip,
  };
};

// 3. useDebounce Hook
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// 4. useLocalStorage Hook
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (err) {
      console.error(err);
    }
  };

  return [storedValue, setValue];
};

// 5. useFetch Hook
export const useFetch = (fetchFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchFunction()
      .then((res) => {
        if (isMounted) {
          setData(res);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) setError(err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return { data, loading, error };
};

// 6. usePrevious Hook
export const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

// 7. useAsync Hook
export const useAsync = (asyncFunction, immediate = true) => {
  const [status, setStatus] = useState('idle');
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(
    (...args) => {
      setStatus('pending');
      setValue(null);
      setError(null);

      return asyncFunction(...args)
        .then((response) => {
          setValue(response);
          setStatus('success');
          return response;
        })
        .catch((err) => {
          setError(err);
          setStatus('error');
          throw err;
        });
    },
    [asyncFunction]
  );

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, value, error, isLoading: status === 'pending' };
};
