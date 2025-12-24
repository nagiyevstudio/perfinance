import { useEffect, useState } from 'react';
import Layout from '../components/common/Layout';
import MaterialIcon from '../components/common/MaterialIcon';
import { useAuth } from '../store/auth';
import { authApi, exportApi } from '../services/api';
import { getCurrentMonth } from '../utils/format';
import { applyTheme, getStoredTheme, setStoredTheme, type ThemePreference } from '../utils/theme';
import { useI18n } from '../i18n';

export default function Settings() {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useI18n();
  const [exportMonth, setExportMonth] = useState(getCurrentMonth());
  const [isExporting, setIsExporting] = useState(false);
  const [exportAll, setExportAll] = useState(false);
  const [themePreference, setThemePreference] = useState<ThemePreference>(getStoredTheme());
  const appVersion = __APP_VERSION__ || '-';

  useEffect(() => {
    setStoredTheme(themePreference);
    applyTheme(themePreference);
  }, [themePreference]);

  const themeButtonBase =
    'inline-flex items-center justify-center h-10 px-4 rounded-full border text-sm font-medium shadow-sm transition-colors cursor-pointer focus-within:outline-none focus-within:ring-2 focus-within:ring-[#d27b30] focus-within:ring-offset-2 focus-within:ring-offset-white dark:focus-within:ring-offset-[#1a1a1a]';
  const themeButtonInactive =
    'border-gray-200 text-gray-700 bg-white/80 hover:bg-gray-50 dark:border-[#2a2a2a] dark:text-[#d4d4d8] dark:bg-[#1a1a1a]/70 dark:hover:bg-[#212121]';
  const themeButtonActive =
    'bg-[#d27b30] text-white border-[#d27b30] shadow-sm';
  const themeOptions: { value: ThemePreference; label: string }[] = [
    { value: 'light', label: t('settings.themeLight') },
    { value: 'dark', label: t('settings.themeDark') },
    { value: 'auto', label: t('settings.themeAuto') },
  ];

  const languageOptions: { value: 'ru' | 'az' | 'en'; label: string }[] = [
    { value: 'ru', label: t('settings.languageRu') },
    { value: 'az', label: t('settings.languageAz') },
    { value: 'en', label: t('settings.languageEn') },
  ];

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    logout();
    window.location.href = '/login';
  };

  const handleExportJSON = async () => {
    try {
      setIsExporting(true);
      await exportApi.json(exportAll ? undefined : exportMonth);
    } catch (error) {
      console.error('Export error:', error);
      alert(t('settings.exportError'));
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      setIsExporting(true);
      await exportApi.csv(exportAll ? undefined : exportMonth);
    } catch (error) {
      console.error('Export error:', error);
      alert(t('settings.exportError'));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="bg-white dark:bg-[#1a1a1a] shadow rounded-lg p-6 text-left">
              <h2 className="text-lg font-medium text-gray-900 dark:text-[#e5e7eb] mb-4">
                {t('settings.profileTitle')}
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#d27b30]/10 text-[#d27b30] flex items-center justify-center">
                  <MaterialIcon name="settings" className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-[#a3a3a3]">
                    {t('settings.profileName')}
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-[#e5e7eb]">
                    {user?.name?.trim() || '—'}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-[#a3a3a3]">
                    {t('settings.profileEmail')}
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-[#e5e7eb]">
                    {user?.email}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-[#a3a3a3]">
                    {t('settings.profileRole')}
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-[#e5e7eb]">
                    {user?.role ? t(`roles.${user.role}`) : '-'}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1a1a1a] shadow rounded-lg p-6 text-left">
              <h2 className="text-lg font-medium text-gray-900 dark:text-[#e5e7eb] mb-4">
                {t('settings.exportTitle')}
              </h2>
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-[#d4d4d8]">
                  <input
                    type="checkbox"
                    checked={exportAll}
                    onChange={(e) => setExportAll(e.target.checked)}
                    className="pf-checkbox"
                  />
                  {t('settings.exportAll')}
                </label>

                {!exportAll && (
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-gray-500 dark:text-[#a3a3a3] mb-2">
                      {t('settings.exportMonth')}
                    </label>
                    <input
                      type="month"
                      value={exportMonth}
                      onChange={(e) => setExportMonth(e.target.value)}
                      className="pf-input w-full sm:w-auto max-w-xs"
                    />
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleExportJSON}
                    disabled={isExporting}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d27b30] text-white hover:bg-[#b56726] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MaterialIcon name="archive" className="h-4 w-4" />
                    {isExporting ? t('settings.exporting') : t('settings.exportJson')}
                  </button>
                  <button
                    onClick={handleExportCSV}
                    disabled={isExporting}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#d27b30] text-[#d27b30] hover:bg-[#d27b30]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MaterialIcon name="archive" className="h-4 w-4" />
                    {isExporting ? t('settings.exporting') : t('settings.exportCsv')}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-[#1a1a1a] shadow rounded-lg p-6 text-left">
              <h2 className="text-lg font-medium text-gray-900 dark:text-[#e5e7eb] mb-4">
                {t('settings.themeTitle')}
              </h2>
              <div className="flex flex-wrap gap-2">
                {themeOptions.map((option) => {
                  const isActive = themePreference === option.value;
                  return (
                    <label
                      key={option.value}
                      className={`${themeButtonBase} ${
                        isActive ? themeButtonActive : themeButtonInactive
                      }`}
                    >
                      <input
                        type="radio"
                        name="theme"
                        value={option.value}
                        checked={isActive}
                        onChange={() => setThemePreference(option.value)}
                        className="sr-only"
                      />
                      {option.label}
                    </label>
                  );
                })}
              </div>
              <p className="mt-3 text-xs text-gray-500 dark:text-[#a3a3a3]">
                {t('settings.themeHint')}
              </p>
            </div>

            <div className="bg-white dark:bg-[#1a1a1a] shadow rounded-lg p-6 text-left">
              <h2 className="text-lg font-medium text-gray-900 dark:text-[#e5e7eb] mb-4">
                {t('settings.currencyTitle')}
              </h2>
              <p className="text-sm text-gray-600 dark:text-[#a3a3a3]">
                {t('settings.currencyLabel')}{' '}
                <span className="font-medium">
                  {t('settings.currencyName', { currency: '₼' })}
                </span>
              </p>
            </div>

            <div className="bg-white dark:bg-[#1a1a1a] shadow rounded-lg p-6 text-left">
              <h2 className="text-lg font-medium text-gray-900 dark:text-[#e5e7eb] mb-4">
                {t('settings.versionTitle')}
              </h2>
              <p className="text-sm text-gray-600 dark:text-[#a3a3a3]">
                {t('settings.versionLabel')}{' '}
                <span className="font-medium">{appVersion}</span>
              </p>
            </div>

            <div className="bg-white dark:bg-[#1a1a1a] shadow rounded-lg p-6 text-left">
              <h2 className="text-lg font-medium text-gray-900 dark:text-[#e5e7eb] mb-4">
                {t('settings.sessionTitle')}
              </h2>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-700 hover:bg-red-500/20 dark:text-red-300"
              >
                <MaterialIcon name="logout" className="h-4 w-4" />
                {t('settings.logout')}
              </button>
            </div>

            <div className="bg-white dark:bg-[#1a1a1a] shadow rounded-lg p-6 text-left">
              <h2 className="text-lg font-medium text-gray-900 dark:text-[#e5e7eb] mb-4">
                {t('settings.languageTitle')}
              </h2>
              <div className="flex flex-wrap gap-2">
                {languageOptions.map((option) => {
                  const isActive = language === option.value;
                  return (
                    <label
                      key={option.value}
                      className={`${themeButtonBase} ${
                        isActive ? themeButtonActive : themeButtonInactive
                      }`}
                    >
                      <input
                        type="radio"
                        name="language"
                        value={option.value}
                        checked={isActive}
                        onChange={() => setLanguage(option.value)}
                        className="sr-only"
                      />
                      {option.label}
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}



