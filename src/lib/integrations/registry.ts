import { IntegrationProvider } from './base.provider';
import { GmailProvider } from './providers/gmail.provider';
import { SlackProvider } from './providers/slack.provider';
import { WebhookProvider } from './providers/webhook.provider';
import { GoogleSheetsProvider } from './providers/google-sheets.provider';
import { StripeProvider } from './providers/stripe.provider';
import { AirtableProvider } from './providers/airtable.provider';
import { TwilioProvider } from './providers/twilio.provider';
import { HubSpotProvider } from './providers/hubspot.provider';
import { AcuityProvider } from './providers/acuity.provider';
import { CalendlyProvider } from './providers/calendly.provider';
import { DatabaseProvider } from './providers/database.provider';
import { DropboxProvider } from './providers/dropbox.provider';
import { FacebookLeadsProvider } from './providers/facebook-leads.provider';
import { GoogleCalendarProvider } from './providers/google-calendar.provider';
import { GoogleDriveProvider } from './providers/google-drive.provider';
import { GoogleFormsProvider } from './providers/google-forms.provider';
import { InstagramProvider } from './providers/instagram.provider';
import { JotformProvider } from './providers/jotform.provider';
import { LinkedInProvider } from './providers/linkedin.provider';
import { MicrosoftExcelProvider } from './providers/microsoft-excel.provider';
import { OneDriveProvider } from './providers/onedrive.provider';
import { OpenTableProvider } from './providers/opentable.provider';
import { OutlookProvider } from './providers/outlook.provider';
import { PayPalProvider } from './providers/paypal.provider';
import { PipedriveProvider } from './providers/pipedrive.provider';
import { QuickBooksProvider } from './providers/quickbooks.provider';
import { SalesforceProvider } from './providers/salesforce.provider';
import { ServiceTitanProvider } from './providers/servicetitan.provider';
import { ShopifyProvider } from './providers/shopify.provider';
import { SquareProvider } from './providers/square.provider';
import { ToastPosProvider } from './providers/toast-pos.provider';
import { TypeformProvider } from './providers/typeform.provider';
import { WhatsAppProvider } from './providers/whatsapp.provider';
import { WooCommerceProvider } from './providers/woocommerce.provider';
import { ZillowProvider } from './providers/zillow.provider';
import { NotionProvider } from './providers/notion.provider';
import { DiscordProvider } from './providers/discord.provider';
import { GitHubProvider } from './providers/github.provider';
import { OpenAIProvider } from './providers/openai.provider';
import { GoogleYouTubeProvider } from './providers/google-youtube.provider';
import { GoogleMapsProvider } from './providers/google-maps.provider';
import { GoogleGeminiProvider } from './providers/google-gemini.provider';

const providers = new Map<string, IntegrationProvider>();

// Register all providers
const register = (id: string, provider: IntegrationProvider) => providers.set(id, provider);

register('gmail', new GmailProvider());
register('slack', new SlackProvider());
register('webhook', new WebhookProvider());
register('google-sheets', new GoogleSheetsProvider());
register('stripe', new StripeProvider());
register('airtable', new AirtableProvider());
register('twilio', new TwilioProvider());
register('hubspot', new HubSpotProvider());
register('acuity', new AcuityProvider());
register('calendly', new CalendlyProvider());
register('database', new DatabaseProvider());
register('dropbox', new DropboxProvider());
register('facebook-leads', new FacebookLeadsProvider());
register('google-calendar', new GoogleCalendarProvider());
register('google-drive', new GoogleDriveProvider());
register('google-forms', new GoogleFormsProvider());
register('instagram', new InstagramProvider());
register('jotform', new JotformProvider());
register('linkedin', new LinkedInProvider());
register('microsoft-excel', new MicrosoftExcelProvider());
register('onedrive', new OneDriveProvider());
register('opentable', new OpenTableProvider());
register('outlook', new OutlookProvider());
register('paypal', new PayPalProvider());
register('pipedrive', new PipedriveProvider());
register('quickbooks', new QuickBooksProvider());
register('salesforce', new SalesforceProvider());
register('servicetitan', new ServiceTitanProvider());
register('shopify', new ShopifyProvider());
register('square', new SquareProvider());
register('toast-pos', new ToastPosProvider());
register('typeform', new TypeformProvider());
register('whatsapp', new WhatsAppProvider());
register('woocommerce', new WooCommerceProvider());
register('zillow', new ZillowProvider());
register('notion', new NotionProvider());
register('discord', new DiscordProvider());
register('github', new GitHubProvider());
register('openai', new OpenAIProvider());
register('youtube', new GoogleYouTubeProvider());
register('google-maps', new GoogleMapsProvider());
register('google-gemini', new GoogleGeminiProvider());

export function getProvider(name: string): IntegrationProvider | undefined {
    return providers.get(name.toLowerCase());
}

export function getAllProviders(): { id: string, provider: IntegrationProvider }[] {
    return Array.from(providers.entries()).map(([id, provider]) => ({ id, provider }));
}

export function hasProvider(name: string): boolean {
    return providers.has(name.toLowerCase());
}
