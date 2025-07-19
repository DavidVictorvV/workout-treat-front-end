interface GoogleAccountsId {
  initialize: (options: {
    client_id: string;
    callback: (response: { credential: string }) => void;
  }) => void;
  renderButton: (
    parent: HTMLElement | null,
    options: { type?: string; theme?: string; size?: string }
  ) => void;
}

interface Window {
  google: {
    accounts: {
      id: GoogleAccountsId;
    };
  };
}
