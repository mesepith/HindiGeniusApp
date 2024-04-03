export const setUser = (user: any) => ({
    type: 'SET_USER',
    payload: user,
  });

export const clearUser = () => ({
    type: 'CLEAR_USER',
});
  