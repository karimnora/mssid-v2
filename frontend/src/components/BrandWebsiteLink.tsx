import React from 'react';
import {canUseWebCheckout} from '../utils/paymentPlatform';
export function BrandWebsiteLink(){return canUseWebCheckout()?<a dir="ltr" href="https://mssid-dz.com">mssid-dz.com</a>:<span dir="ltr">mssid-dz.com</span>;}
