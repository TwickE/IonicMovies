interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
  /**
   * Built-in environment variables.
   */
  readonly NG_APP_ENV: string;
  // Add your custom variables here for autocomplete:
  readonly NG_APP_API_KEY: string;
  [key: string]: any;
}