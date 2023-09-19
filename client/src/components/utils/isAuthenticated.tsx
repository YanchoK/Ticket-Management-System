export default function isAuthenticated(): Promise<boolean | void> {
    return fetch('api/checkAuth').then((res) => {
      if (res.status === 200) {
        return true
      }
    }).catch((err) => {
      console.error(err);
    });
  }