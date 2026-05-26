import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  ChevronRight, 
  Star, 
  TrendingUp, 
  ShoppingBag,
  Sparkles,
  ShoppingBasket,
  X,
  ArrowRight,
  Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { affiliateService } from '../services/affiliateService';
import { AffiliateOffer, AffiliateCategory, AffiliatePartner } from '../types';
import { CoinIcon } from '../components/CoinIcon';
import { Skeleton } from '../components/Skeleton';
import { SEO } from '../components/SEO';
import { client, APPWRITE_CONFIG } from '../lib/appwrite';

export const ShopEarnHome = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = React.useState<AffiliateOffer[]>([]);
  const [partners, setPartners] = React.useState<AffiliatePartner[]>([]);
  const [categories, setCategories] = React.useState<AffiliateCategory[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [selectedTab, setSelectedTab] = React.useState<'offers' | 'brands'>('offers');
  
  // Brand selection modal
  const [selectedBrand, setSelectedBrand] = React.useState<AffiliatePartner | null>(null);

  React.useEffect(() => {
    let active = true;

    const fetchData = async (showLoading = true) => {
      if (showLoading) setLoading(true);
      try {
        const [offersData, partnersData, catsData] = await Promise.all([
          affiliateService.getOffers(),
          affiliateService.getPartners(),
          affiliateService.getCategories()
        ]);
        if (active) {
          setOffers(offersData);
          setPartners(partnersData);
          setCategories(catsData);
        }
      } catch (err) {
        console.error('[REALTIME] Fetch failed:', err);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchData(true);

    // Appwrite Realtime Subscriptions
    const dbId = APPWRITE_CONFIG.databaseId;
    const offersColl = APPWRITE_CONFIG.collections.affiliate_offers;
    const partnersColl = APPWRITE_CONFIG.collections.affiliate_partners;
    const categoriesColl = APPWRITE_CONFIG.collections.affiliate_categories;

    const channels = [
      `databases.${dbId}.collections.${offersColl}.documents`,
      `databases.${dbId}.collections.${partnersColl}.documents`,
      `databases.${dbId}.collections.${categoriesColl}.documents`
    ];

    let unsubscribe: (() => void) | null = null;
    try {
      unsubscribe = client.subscribe(channels, (response) => {
        if (import.meta.env.DEV) {
          console.log('[REALTIME] Affiliate entity modification detected:', response);
        }
        fetchData(false);
      });
    } catch (err) {
      console.warn('[REALTIME] Appwrite SDK sub error. Using local sync as core:', err);
    }

    const handleLocalRealtimeUpdate = () => {
      fetchData(false);
    };

    window.addEventListener('nexvy_realtime_update', handleLocalRealtimeUpdate);

    return () => {
      active = false;
      if (unsubscribe) unsubscribe();
      window.removeEventListener('nexvy_realtime_update', handleLocalRealtimeUpdate);
    };
  }, []);

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         offer.partnerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || offer.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredPartners = partners.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const trendingOffers = offers.filter(o => o.isTrending);

  // Active brand specific offers in modal view
  const selectedBrandOffers = selectedBrand 
    ? offers.filter(o => o.partnerName.toLowerCase() === selectedBrand.name.toLowerCase() || o.partnerId === (selectedBrand.id || selectedBrand.$id))
    : [];

  return (
    <>
      <SEO title="Shop & Earn" description="Purchase from your favorite brands and earn Nexvy coins as rewards." />
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="relative overflow-hidden gaming-card p-6 bg-gradient-to-br from-emerald-600 to-teal-900 border-emerald-400/20 rounded-[32px]">
          <div className="relative z-10">
            <h1 className="text-2xl font-display font-black text-white italic tracking-tighter">SHOP & EARN</h1>
            <p className="text-emerald-100/60 text-xs font-bold uppercase tracking-widest mt-1">Earn rewards on every purchase</p>
          </div>
          <ShoppingBag className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 rotate-12" />
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
            <input 
              type="text"
              placeholder={selectedTab === 'offers' ? "Search offers or brands..." : "Search partner brands..."}
              className="w-full bg-black/5 border border-black/10 rounded-2xl py-3 pl-11 pr-4 text-sm text-black focus:outline-none focus:border-emerald-500/50 transition-all font-bold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {/* All Offers Option - Placed to the Left of All Brands */}
            <button 
              onClick={() => {
                setSelectedTab('offers');
                setSelectedCategory('all');
              }}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all border cursor-pointer ${
                selectedTab === 'offers' && selectedCategory === 'all'
                ? 'bg-emerald-500 border-emerald-400 text-black shadow-lg shadow-emerald-500/20' 
                : 'bg-black/5 border-black/10 text-black/60 hover:border-black/20'
              }`}
            >
              All Offers
            </button>

            {/* All Brands Option */}
            <button 
              onClick={() => {
                setSelectedTab('brands');
                setSelectedCategory('all');
              }}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all border cursor-pointer ${
                selectedTab === 'brands' && selectedCategory === 'all'
                ? 'bg-emerald-500 border-emerald-400 text-black shadow-lg shadow-emerald-500/20' 
                : 'bg-black/5 border-black/10 text-black/60 hover:border-black/20'
              }`}
            >
              All Brands
            </button>

            {categories.map((cat, index) => {
              const isSelected = selectedCategory === cat.slug;
              return (
                <button 
                  key={cat.id || cat.$id || `cat-${index}`}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all border cursor-pointer ${
                    isSelected 
                    ? 'bg-emerald-500 border-emerald-400 text-black shadow-lg shadow-emerald-500/20' 
                    : 'bg-black/5 border-black/10 text-black/60 hover:border-black/20'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Trending Section - Offers only */}
        {selectedTab === 'offers' && trendingOffers.length > 0 && selectedCategory === 'all' && !searchTerm && (
          <div>
            <div className="flex items-center gap-2 mb-4 px-2 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
              <h3 className="font-display font-black text-lg uppercase italic tracking-tight">Trending Offers</h3>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {trendingOffers.map((offer, index) => (
                <motion.div 
                  key={offer.id || offer.$id || `trend-${index}`}
                  whileHover={{ y: -5 }}
                  onClick={() => navigate(`/shop-earn/${offer.id}`)}
                  className="min-w-[280px] gaming-card p-5 bg-white/5 border-white/10 relative overflow-hidden group cursor-pointer transition-all hover:border-emerald-500/30"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2 shadow-inner">
                      {offer.partnerLogo ? (
                        <img src={offer.partnerLogo} alt={offer.partnerName} className="w-full h-full object-contain" />
                      ) : (
                        <ShoppingBasket className="w-6 h-6 text-emerald-900" />
                      )}
                    </div>
                    <div className="flex items-center gap-1 bg-emerald-500/20 px-2 py-1 rounded-lg border border-emerald-500/30">
                      <CoinIcon size={12} />
                      <span className="text-[10px] font-black text-emerald-400">+{offer.rewardCoins}</span>
                    </div>
                  </div>
                  <h4 className="text-sm font-black text-black mb-1 line-clamp-1">{offer.title}</h4>
                  <p className="text-[10px] text-black/40 font-bold uppercase mb-4">{offer.partnerName}</p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-[8px] font-black text-emerald-400 uppercase bg-emerald-400/10 px-2 py-0.5 rounded">
                      {offer.cashbackPercentage}% Cashback
                    </span>
                    <ChevronRight className="w-4 h-4 text-black/20 group-hover:text-emerald-400 transition-colors" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* List Content Section */}
        <div>
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="font-display font-black text-lg uppercase italic text-black/80 tracking-tight">
              {selectedTab === 'offers' 
                ? (selectedCategory === 'all' ? 'Featured Offers' : `${categories.find(c => c.slug === selectedCategory)?.name || 'Filtered'} Offers`)
                : (selectedCategory === 'all' ? 'Partner Brands' : `${categories.find(c => c.slug === selectedCategory)?.name || 'Filtered'} Brands`)
              }
            </h3>
          </div>
          
          <div className="flex flex-col gap-3">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="gaming-card p-4 flex items-center gap-4">
                  <Skeleton className="w-16 h-16 rounded-2xl" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-8 w-20 rounded-xl" />
                </div>
              ))
            ) : selectedTab === 'offers' ? (
              filteredOffers.length === 0 ? (
                <div className="gaming-card p-12 text-center flex flex-col items-center gap-4 bg-black/5 border-dashed">
                  <ShoppingBag className="w-12 h-12 text-black/10" />
                  <p className="text-black/40 font-bold uppercase text-xs tracking-widest">No matching offers found</p>
                </div>
              ) : (
                filteredOffers.map((offer, index) => (
                  <motion.div 
                    key={offer.id || offer.$id || `offer-${index}`}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/shop-earn/${offer.id}`)}
                    className="gaming-card p-4 flex items-center gap-4 group cursor-pointer hover:bg-white/10 transition-all border-white/5"
                  >
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-3 shadow-inner group-hover:scale-105 transition-transform shrink-0">
                      {offer.partnerLogo ? (
                        <img src={offer.partnerLogo} alt={offer.partnerName} className="w-full h-full object-contain" />
                      ) : (
                        <ShoppingBasket className="w-8 h-8 text-emerald-950" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-tight">{offer.partnerName}</span>
                        {offer.isFeatured && <Sparkles className="w-3 h-3 text-yellow-400" />}
                      </div>
                      <h4 className="text-sm font-black text-black leading-tight mb-1 line-clamp-1">{offer.title}</h4>
                      <div className="flex items-center gap-2">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-[10px] text-black/40 font-bold">4.8</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 text-right shrink-0">
                      <div className="flex items-center gap-1">
                        <CoinIcon size={14} />
                        <span className="text-sm font-black text-black">+{offer.rewardCoins}</span>
                      </div>
                      <span className="text-[9px] font-black text-emerald-400 uppercase bg-emerald-400/10 px-2 py-0.5 rounded">
                        Details
                      </span>
                    </div>
                  </motion.div>
                ))
              )
            ) : (
              // Brands View Tab
              filteredPartners.length === 0 ? (
                <div className="gaming-card p-12 text-center flex flex-col items-center gap-4 bg-black/5 border-dashed">
                  <ShoppingBag className="w-12 h-12 text-black/10" />
                  <p className="text-black/40 font-bold uppercase text-xs tracking-widest">No matching brands found</p>
                </div>
              ) : (
                filteredPartners.map((partner, index) => {
                  const partnerOfferCount = offers.filter(o => o.partnerName.toLowerCase() === partner.name.toLowerCase() || o.partnerId === (partner.id || partner.$id)).length;
                  return (
                    <motion.div 
                      key={partner.id || partner.$id || `partner-${index}`}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedBrand(partner)}
                      className="gaming-card p-4 flex items-center gap-4 group cursor-pointer hover:bg-white/10 transition-all border-white/5"
                    >
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-3 shadow-inner group-hover:scale-105 transition-transform shrink-0">
                        {partner.logoUrl ? (
                          <img src={partner.logoUrl} alt={partner.name} className="w-full h-full object-contain" />
                        ) : (
                          <ShoppingBasket className="w-8 h-8 text-emerald-950" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-tight">Vetted Partner</span>
                          <Star className="w-3 h-3 text-yellow-500 fill-current ml-1" />
                          <span className="text-[10px] text-black/40 font-bold">{partner.rating || 5.0}</span>
                        </div>
                        <h4 className="text-sm font-black text-black leading-tight mb-1 line-clamp-1">{partner.name}</h4>
                        <p className="text-[10px] text-black/50 line-clamp-1">{partner.description || 'Verified Affiliate Partner'}</p>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 text-right shrink-0">
                        <span className="text-[9px] font-sans font-black text-black bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-lg">
                          {partnerOfferCount} {partnerOfferCount === 1 ? 'Offer' : 'Offers'}
                        </span>
                        <span className="text-[8px] font-black uppercase text-slate-400 group-hover:text-emerald-400 transition-colors">
                          View details
                        </span>
                      </div>
                    </motion.div>
                  );
                })
              )
            )}
          </div>
        </div>
      </div>

      {/* Brand Dashboard Slide-up Drawer/Modal Details */}
      <AnimatePresence>
        {selectedBrand && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ y: "100%", opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0.5 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="bg-white border-t-4 sm:border-4 border-emerald-500 rounded-t-[32px] sm:rounded-[36px] w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[80vh] shadow-2xl relative text-black"
            >
              {/* Drag bar for mobile */}
              <div className="w-12 h-1 bg-black/20 rounded-full mx-auto my-3 sm:hidden" />

              <div className="p-6 border-b border-black/5 relative flex items-start gap-4 pr-12">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-2 shadow-inner shrink-0 leading-none">
                  {selectedBrand.logoUrl ? (
                    <img src={selectedBrand.logoUrl} alt={selectedBrand.name} className="w-full h-full object-contain" />
                  ) : (
                    <ShoppingBasket className="w-8 h-8 text-emerald-950" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">Verified Brand Partner</span>
                    <div className="flex items-center gap-0.5 bg-yellow-500/10 border border-yellow-500/20 px-1.5 py-0.5 rounded text-[9px] font-bold text-yellow-400">
                      <Star size={8} className="fill-current" />
                      <span>{selectedBrand.rating || 5.0}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-display font-black text-black italic tracking-tighter uppercase leading-none">
                    {selectedBrand.name}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium mt-1.5 leading-relaxed">
                    {selectedBrand.description || 'Verified Partner offering direct cashback and coin rewards on purchases.'}
                  </p>
                </div>

                <button 
                  onClick={() => setSelectedBrand(null)}
                  className="absolute right-4 top-4 p-2.5 bg-black/5 hover:bg-black/10 rounded-full text-slate-600 hover:text-black transition-colors border-0 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* brand content list */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest font-mono">
                    AVAILABLE DEALS & OFFERS ({selectedBrandOffers.length})
                  </span>
                  {selectedBrand.websiteUrl && (
                    <a 
                      href={selectedBrand.websiteUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="inline-flex items-center gap-1.5 text-[10px] font-black text-emerald-600 uppercase hover:underline"
                    >
                      <Globe size={10} />
                      <span>Main Site</span>
                    </a>
                  )}
                </div>

                {selectedBrandOffers.length === 0 ? (
                  <div className="p-8 text-center bg-black/5 rounded-2xl border border-black/5 flex flex-col items-center gap-3">
                    <ShoppingBag className="w-8 h-8 text-black/10" />
                    <p className="text-slate-600 text-xs font-bold uppercase tracking-wider">No active specials listed</p>
                    {selectedBrand.websiteUrl && (
                      <a 
                        href={selectedBrand.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="gaming-button-yellow py-2.5 px-6 text-2xs mt-1"
                      >
                        Visit Partner Site
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {selectedBrandOffers.map((offer, index) => (
                      <div 
                        key={offer.id || offer.$id || `brand-offer-${index}`}
                        onClick={() => {
                          setSelectedBrand(null);
                          navigate(`/shop-earn/${offer.id}`);
                        }}
                        className="p-4 bg-black/5 hover:bg-black/10 border border-black/5 hover:border-emerald-500/20 rounded-2xl transition-all cursor-pointer group flex items-center justify-between gap-4"
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-black text-black group-hover:text-emerald-600 transition-colors line-clamp-1">
                            {offer.title}
                          </h4>
                          <p className="text-[10px] text-slate-600 font-medium line-clamp-1 mt-0.5">
                            {offer.shortDescription || 'Earn instant rewards.'}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[8px] font-black px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded">
                              {offer.cashbackPercentage || 0}% Cashback
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0 flex items-center gap-3">
                          <div className="flex flex-col items-end">
                            <div className="flex items-center gap-1">
                              <CoinIcon size={14} />
                              <span className="text-sm font-black text-black">+{offer.rewardCoins}</span>
                            </div>
                            <span className="text-[8px] text-slate-500 font-bold block mt-0.5">Coins Max</span>
                          </div>
                          <ArrowRight size={14} className="text-slate-500 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="p-6 bg-slate-100 border-t border-black/5 flex gap-3">
                <button
                  onClick={() => setSelectedBrand(null)}
                  className="flex-1 py-4 bg-black/5 hover:bg-black/10 text-black rounded-2xl font-black uppercase text-xs tracking-wider transition-colors border-0 cursor-pointer text-center"
                >
                  Close Drawer
                </button>
                {selectedBrand.websiteUrl && (
                  <a
                    href={selectedBrand.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-400 text-white text-center rounded-2xl font-black uppercase text-xs tracking-wider transition-colors text-white shadow-xl shadow-emerald-500/10"
                  >
                    Direct Shop
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
export default ShopEarnHome;
