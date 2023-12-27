export type localizationType = {
  title: string;
  about: {
    title: string;
    content: [];
  };
  team: {
    title: string;
    members: {
      semyon: {
        name: string;
        position: string;
        description: string;
      };
      dimash: {
        name: string;
        position: string;
        description: string;
      };
      almas: {
        name: string;
        position: string;
        description: string;
      };
    };
  };
  rss: {
    title: string;
    content: [];
  };
  header: {
    graphQL: string;
    language: {
      russian: string;
      english: string;
    };
    sign: {
      in: string;
      up: string;
    };
  };
  signIn: {
    title: string;
    email: string;
    password: string;
    submit: string;
    hint: string;
    link: string;
  };
  signUp: {
    title: string;
    email: string;
    password: string;
    confirm: string;
    submit: string;
    hint: string;
    link: string;
  };
  graphQL: {
    title: string;
    docs: string;
  };
};
