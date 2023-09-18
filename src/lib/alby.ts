export const fetchUser = async (accessToken: string) => {
  try {
    const response = await fetch('https://api.getalby.com/user/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const data = await response.json();

    if (response.ok) {
      return {
        alby_id: data.identifier,
        avatar: data.avatar,
        email: data.email,
        keysend_custom_key: data.keysend_custom_key,
        keysend_custom_value: data.keysend_custom_value,
        keysend_pubkey: data.keysend_pubkey,
        lightning_address: data.lightning_address,
        name: data.name,
      };
    } else {
      console.error("Error: ", response.statusText);
      return null;
    }
  } catch (error) {
    console.error("An error occurred: ", error);
    return null;
  }
}
