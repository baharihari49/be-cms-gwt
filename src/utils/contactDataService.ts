// utils/contactDataService.ts

export interface ContactData {
  id: number;
  title: string;
  details: string[];
  color: string;
  href: string | null;
}

export interface ContactInfo {
  phone?: string;
  email?: string;
  address?: string;
  whatsapp?: string;
  businessHours?: string;
}

class ContactDataService {
  // Base URL untuk API (sesuaikan dengan setup Anda)
  private readonly API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

  // Fungsi untuk fetch dengan auth (jika diperlukan)
  private async fetchWithAuth(url: string, options: RequestInit = {}) {
    const response = await fetch(`${this.API_URL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        // Tambahkan auth header jika diperlukan
        // 'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Ambil semua data contact dari API
  async getAllContacts(): Promise<ContactData[]> {
    try {
      const response = await this.fetchWithAuth('/api/contacts');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching contacts:', error);
      return [];
    }
  }

  // Parse contact data untuk email template
  async getContactInfoForEmail(): Promise<ContactInfo> {
    try {
      const contacts = await this.getAllContacts();
      
      const contactInfo: ContactInfo = {};

      contacts.forEach(contact => {
        switch (contact.title.toLowerCase()) {
          case 'call us':
            // Ambil nomor telepon dari details
            const phoneDetail = contact.details.find(detail => 
              detail.includes('(+62)') || detail.includes('+62')
            );
            if (phoneDetail) {
              contactInfo.phone = phoneDetail.replace(/[^\d+\-()]/g, '');
              // Untuk WhatsApp, gunakan nomor yang sama
              contactInfo.whatsapp = contactInfo.phone.replace(/[^\d]/g, '');
            }
            break;

          case 'email us':
            // Ambil email dari details
            const emailDetail = contact.details.find(detail => 
              detail.includes('@')
            );
            if (emailDetail) {
              contactInfo.email = emailDetail;
            }
            break;

          case 'visit us':
            // Gabungkan semua address details
            contactInfo.address = contact.details.join(', ');
            break;

          case 'working hours':
            // Gabungkan business hours
            contactInfo.businessHours = contact.details
              .filter(detail => !detail.toLowerCase().includes('closed'))
              .join(', ');
            break;
        }
      });

      return contactInfo;
    } catch (error) {
      console.error('Error parsing contact info:', error);
      // Return default values
      return {
        phone: '+62 812-3456-7890',
        email: 'contact@gwt.co.id',
        whatsapp: '6281234567890',
        businessHours: 'Mon-Fri 9:00 AM - 6:00 PM WIB'
      };
    }
  }

  // Format nomor WhatsApp untuk URL
  formatWhatsAppNumber(phone: string): string {
    return phone.replace(/[^\d]/g, '');
  }

  // Format nomor telepon untuk display
  formatPhoneDisplay(phone: string): string {
    return phone.replace(/[^\d+\-\s()]/g, '');
  }

  // Fetch data tanpa auth (jika endpoint public)
  async getContactsPublic(): Promise<ContactData[]> {
    try {
      const response = await fetch(`${this.API_URL}/api/contacts`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching public contacts:', error);
      return [];
    }
  }
}

export const contactDataService = new ContactDataService();