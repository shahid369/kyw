class AppConfig {
  static const String supabaseUrl = String.fromEnvironment(
    'SUPABASE_URL',
    defaultValue: 'https://wnisxixzztvomixnpkls.supabase.co',
  );

  static const String supabaseAnonKey = String.fromEnvironment(
    'SUPABASE_ANON_KEY',
    defaultValue: 'sb_publishable_MQvk-2GXP7Jyw9Yg0pxJeg_D2PbFpbR',
  );

  // TODO: Paste your Google Web Client ID from Google Cloud Console here
  static const String googleWebClientId = String.fromEnvironment(
    'GOOGLE_WEB_CLIENT_ID',
    defaultValue: '613476373962-6i8vbmfubv2dl03sdtl7kgrnnjhvrovg.apps.googleusercontent.com',
  );

  // TODO: Paste your Google iOS Client ID from Google Cloud Console here
  static const String googleIosClientId = String.fromEnvironment(
    'GOOGLE_IOS_CLIENT_ID',
    defaultValue: '',
  );
}
