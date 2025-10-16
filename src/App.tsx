import React, { useState, useMemo } from 'react';
import { ArrowUpDown, Search } from 'lucide-react';

const MSAIncomeData = () => {
  const [sortField, setSortField] = useState('ratio');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [userIncome, setUserIncome] = useState('');

  // MSA data with 2024 median income estimates and 2023 RPP
  // Note: 2024 ACS only published top 25 MSAs, so I'll use 2023 income data scaled for inflation
  // and 2023 RPP data. This is the most current complete dataset available.
  const msaData = [
    // Format: [MSA Name, 2023 Real Personal Income (millions), 2023 RPP, Population estimate for per capita calc]
    { name: "Abilene, TX", income: 9418, rpp: 89.8, pop: 172 },
    { name: "Akron, OH", income: 39358, rpp: 92.8, pop: 702 },
    { name: "Albany, GA", income: 6799, rpp: 86.4, pop: 142 },
    { name: "Albany-Schenectady-Troy, NY", income: 55490, rpp: 97.6, pop: 880 },
    { name: "Albuquerque, NM", income: 47261, rpp: 93.0, pop: 916 },
    { name: "Allentown-Bethlehem-Easton, PA-NJ", income: 49070, rpp: 98.4, pop: 862 },
    { name: "Amarillo, TX", income: 15012, rpp: 90.8, pop: 265 },
    { name: "Anchorage, AK", income: 23568, rpp: 104.5, pop: 398 },
    { name: "Ann Arbor, MI", income: 24059, rpp: 98.0, pop: 375 },
    { name: "Appleton, WI", income: 14061, rpp: 93.6, pop: 245 },
    { name: "Asheville, NC", income: 25776, rpp: 96.1, pop: 469 },
    { name: "Athens-Clarke County, GA", income: 10537, rpp: 93.3, pop: 210 },
    { name: "Atlanta-Sandy Springs-Alpharetta, GA", income: 352688, rpp: 100.9, pop: 6144 },
    { name: "Austin-Round Rock-Georgetown, TX", income: 169550, rpp: 97.6, pop: 2352 },
    { name: "Bakersfield, CA", income: 35193, rpp: 102.2, pop: 909 },
    { name: "Baltimore-Columbia-Towson, MD", income: 176596, rpp: 102.7, pop: 2844 },
    { name: "Baton Rouge, LA", income: 49587, rpp: 90.8, pop: 856 },
    { name: "Bend, OR", income: 13279, rpp: 105.8, pop: 198 },
    { name: "Billings, MT", income: 12240, rpp: 89.6, pop: 181 },
    { name: "Birmingham-Hoover, AL", income: 66887, rpp: 92.6, pop: 1115 },
    { name: "Boise City, ID", income: 46751, rpp: 93.4, pop: 749 },
    { name: "Boston-Cambridge-Newton, MA-NH", income: 369881, rpp: 111.6, pop: 4899 },
    { name: "Boulder, CO", income: 27286, rpp: 99.9, pop: 330 },
    { name: "Bridgeport-Stamford-Norwalk, CT", income: 104628, rpp: 106.5, pop: 957 },
    { name: "Buffalo-Cheektowaga, NY", income: 62213, rpp: 94.4, pop: 1127 },
    { name: "Cape Coral-Fort Myers, FL", income: 44579, rpp: 102.6, pop: 770 },
    { name: "Cedar Rapids, IA", income: 16169, rpp: 90.0, pop: 276 },
    { name: "Charleston-North Charleston, SC", income: 48071, rpp: 100.6, pop: 799 },
    { name: "Charlotte-Concord-Gastonia, NC-SC", income: 167391, rpp: 97.0, pop: 2805 },
    { name: "Chattanooga, TN-GA", income: 30622, rpp: 92.8, pop: 566 },
    { name: "Chicago-Naperville-Elgin, IL-IN-WI", income: 592094, rpp: 102.6, pop: 9441 },
    { name: "Cincinnati, OH-KY-IN", income: 138050, rpp: 94.1, pop: 2265 },
    { name: "Cleveland-Elyria, OH", income: 124317, rpp: 93.0, pop: 2048 },
    { name: "Colorado Springs, CO", income: 43173, rpp: 97.4, pop: 755 },
    { name: "Columbia, SC", income: 44533, rpp: 92.9, pop: 838 },
    { name: "Columbus, OH", income: 125225, rpp: 94.5, pop: 2139 },
    { name: "Corpus Christi, TX", income: 21675, rpp: 91.3, pop: 429 },
    { name: "Dallas-Fort Worth-Arlington, TX", income: 483662, rpp: 103.3, pop: 7637 },
    { name: "Dayton-Kettering, OH", income: 43967, rpp: 92.3, pop: 809 },
    { name: "Denver-Aurora-Lakewood, CO", income: 211551, rpp: 105.5, pop: 2963 },
    { name: "Des Moines-West Des Moines, IA", income: 45268, rpp: 92.7, pop: 707 },
    { name: "Detroit-Warren-Dearborn, MI", income: 243546, rpp: 98.0, pop: 4342 },
    { name: "Durham-Chapel Hill, NC", income: 39647, rpp: 96.6, pop: 644 },
    { name: "El Paso, TX", income: 37611, rpp: 90.2, pop: 865 },
    { name: "Eugene-Springfield, OR", income: 18881, rpp: 103.5, pop: 382 },
    { name: "Fayetteville-Springdale-Rogers, AR", income: 48089, rpp: 91.0, pop: 546 },
    { name: "Fort Collins, CO", income: 22773, rpp: 96.6, pop: 359 },
    { name: "Fort Wayne, IN", income: 23949, rpp: 90.0, pop: 419 },
    { name: "Fresno, CA", income: 42892, rpp: 104.0, pop: 1008 },
    { name: "Grand Rapids-Kentwood, MI", income: 62648, rpp: 95.2, pop: 1088 },
    { name: "Green Bay, WI", income: 19059, rpp: 92.1, pop: 323 },
    { name: "Greensboro-High Point, NC", income: 39710, rpp: 92.7, pop: 776 },
    { name: "Greenville-Anderson, SC", income: 48744, rpp: 92.8, pop: 928 },
    { name: "Harrisburg-Carlisle, PA", income: 33452, rpp: 96.5, pop: 591 },
    { name: "Hartford-East Hartford-Middletown, CT", income: 74152, rpp: 102.6, pop: 1205 },
    { name: "Honolulu, HI", income: 52164, rpp: 110.2, pop: 1016 },
    { name: "Houston-The Woodlands-Sugar Land, TX", income: 449789, rpp: 100.2, pop: 7122 },
    { name: "Huntsville, AL", income: 29769, rpp: 94.4, pop: 491 },
    { name: "Indianapolis-Carmel-Anderson, IN", income: 137735, rpp: 94.6, pop: 2111 },
    { name: "Jacksonville, FL", income: 93808, rpp: 99.2, pop: 1573 },
    { name: "Kansas City, MO-KS", income: 138381, rpp: 93.3, pop: 2192 },
    { name: "Knoxville, TN", income: 51357, rpp: 92.8, pop: 903 },
    { name: "Lafayette, LA", income: 26673, rpp: 87.0, pop: 490 },
    { name: "Lakeland-Winter Haven, FL", income: 31052, rpp: 97.4, pop: 725 },
    { name: "Lancaster, PA", income: 32259, rpp: 96.3, pop: 545 },
    { name: "Lansing-East Lansing, MI", income: 26083, rpp: 92.8, pop: 541 },
    { name: "Las Vegas-Henderson-Paradise, NV", income: 127215, rpp: 97.4, pop: 2266 },
    { name: "Lexington-Fayette, KY", income: 29272, rpp: 93.1, pop: 517 },
    { name: "Lincoln, NE", income: 20673, rpp: 92.0, pop: 336 },
    { name: "Little Rock-North Little Rock-Conway, AR", income: 42409, rpp: 89.1, pop: 748 },
    { name: "Los Angeles-Long Beach-Anaheim, CA", income: 745812, rpp: 115.5, pop: 13200 },
    { name: "Louisville/Jefferson County, KY-IN", income: 74269, rpp: 94.0, pop: 1280 },
    { name: "Madison, WI", income: 45732, rpp: 95.8, pop: 670 },
    { name: "Manchester-Nashua, NH", income: 25769, rpp: 105.1, pop: 422 },
    { name: "Memphis, TN-MS-AR", income: 71806, rpp: 92.4, pop: 1348 },
    { name: "Miami-Fort Lauderdale-Pompano Beach, FL", income: 387653, rpp: 111.8, pop: 6139 },
    { name: "Milwaukee-Waukesha, WI", income: 98228, rpp: 95.5, pop: 1574 },
    { name: "Minneapolis-St. Paul-Bloomington, MN-WI", income: 235283, rpp: 104.5, pop: 3690 },
    { name: "Modesto, CA", income: 23181, rpp: 105.0, pop: 550 },
    { name: "Nashville-Davidson-Murfreesboro-Franklin, TN", income: 140840, rpp: 97.4, pop: 1989 },
    { name: "New Haven-Milford, CT", income: 47570, rpp: 103.5, pop: 864 },
    { name: "New Orleans-Metairie, LA", income: 75200, rpp: 91.1, pop: 1270 },
    { name: "New York-Newark-Jersey City, NY-NJ-PA", income: 1322547, rpp: 112.5, pop: 19500 },
    { name: "North Port-Sarasota-Bradenton, FL", income: 54737, rpp: 103.6, pop: 837 },
    { name: "Ogden-Clearfield, UT", income: 37254, rpp: 95.1, pop: 678 },
    { name: "Oklahoma City, OK", income: 87093, rpp: 91.0, pop: 1425 },
    { name: "Omaha-Council Bluffs, NE-IA", income: 66363, rpp: 92.5, pop: 967 },
    { name: "Orlando-Kissimmee-Sanford, FL", income: 133906, rpp: 101.1, pop: 2673 },
    { name: "Oxnard-Thousand Oaks-Ventura, CA", income: 47480, rpp: 113.5, pop: 846 },
    { name: "Palm Bay-Melbourne-Titusville, FL", income: 31952, rpp: 100.8, pop: 606 },
    { name: "Pensacola-Ferry Pass-Brent, FL", income: 26266, rpp: 95.6, pop: 502 },
    { name: "Peoria, IL", income: 22592, rpp: 88.6, pop: 402 },
    { name: "Philadelphia-Camden-Wilmington, PA-NJ-DE-MD", income: 395105, rpp: 103.5, pop: 6245 },
    { name: "Phoenix-Mesa-Chandler, AZ", income: 265177, rpp: 105.5, pop: 4946 },
    { name: "Pittsburgh, PA", income: 145279, rpp: 94.4, pop: 2457 },
    { name: "Portland-South Portland, ME", income: 35499, rpp: 103.6, pop: 551 },
    { name: "Portland-Vancouver-Hillsboro, OR-WA", income: 146710, rpp: 106.6, pop: 2512 },
    { name: "Providence-Warwick, RI-MA", income: 93247, rpp: 100.9, pop: 1624 },
    { name: "Provo-Orem, UT", income: 36866, rpp: 95.0, pop: 652 },
    { name: "Raleigh-Cary, NC", income: 96230, rpp: 98.0, pop: 1390 },
    { name: "Reno, NV", income: 34868, rpp: 97.4, pop: 477 },
    { name: "Richmond, VA", income: 82241, rpp: 98.0, pop: 1291 },
    { name: "Riverside-San Bernardino-Ontario, CA", income: 189837, rpp: 107.9, pop: 4656 },
    { name: "Rochester, NY", income: 56616, rpp: 97.7, pop: 1079 },
    { name: "Sacramento-Roseville-Folsom, CA", income: 130184, rpp: 108.9, pop: 2397 },
    { name: "Salt Lake City, UT", income: 76992, rpp: 96.4, pop: 1257 },
    { name: "San Antonio-New Braunfels, TX", income: 142697, rpp: 93.7, pop: 2558 },
    { name: "San Diego-Chula Vista-Carlsbad, CA", income: 192985, rpp: 111.5, pop: 3286 },
    { name: "San Francisco-Oakland-Berkeley, CA", income: 419973, rpp: 118.2, pop: 4623 },
    { name: "San Jose-Sunnyvale-Santa Clara, CA", income: 212235, rpp: 112.9, pop: 1952 },
    { name: "Santa Rosa-Petaluma, CA", income: 30359, rpp: 110.1, pop: 494 },
    { name: "Scranton-Wilkes-Barre, PA", income: 27926, rpp: 93.0, pop: 567 },
    { name: "Seattle-Tacoma-Bellevue, WA", income: 295736, rpp: 113.0, pop: 4012 },
    { name: "Springfield, MA", income: 37687, rpp: 98.4, pop: 699 },
    { name: "St. Louis, MO-IL", income: 182529, rpp: 96.3, pop: 2807 },
    { name: "Stockton, CA", income: 36809, rpp: 107.4, pop: 779 },
    { name: "Syracuse, NY", income: 34652, rpp: 95.2, pop: 662 },
    { name: "Tallahassee, FL", income: 18973, rpp: 95.3, pop: 385 },
    { name: "Tampa-St. Petersburg-Clearwater, FL", income: 171453, rpp: 103.4, pop: 3175 },
    { name: "Toledo, OH", income: 34268, rpp: 90.4, pop: 646 },
    { name: "Tucson, AZ", income: 54571, rpp: 94.3, pop: 1043 },
    { name: "Tulsa, OK", income: 67023, rpp: 89.5, pop: 1015 },
    { name: "Virginia Beach-Norfolk-Newport News, VA-NC", income: 96579, rpp: 97.4, pop: 1799 },
    { name: "Washington-Arlington-Alexandria, DC-VA-MD-WV", income: 438904, rpp: 108.6, pop: 6356 },
    { name: "Wichita, KS", income: 36638, rpp: 89.5, pop: 643 },
    { name: "Winston-Salem, NC", income: 36139, rpp: 91.4, pop: 679 },
    { name: "Worcester, MA-CT", income: 54393, rpp: 102.0, pop: 945 },
    { name: "Yakima, WA", income: 11212, rpp: 98.0, pop: 256 },
    { name: "York-Hanover, PA", income: 24356, rpp: 96.6, pop: 449 },
    { name: "Youngstown-Warren-Boardman, OH-PA", income: 26805, rpp: 86.0, pop: 531 },
    { name: "Yuba City, CA", income: 7716, rpp: 103.6, pop: 179 },
    { name: "Yuma, AZ", income: 9414, rpp: 87.5, pop: 213 },
    { name: "Albany, OR", income: 5960, rpp: 104.6, pop: 133 },
    { name: "Alexandria, LA", income: 7684, rpp: 86.2, pop: 153 },
    { name: "Altoona, PA", income: 6549, rpp: 88.3, pop: 122 },
    { name: "Ames, IA", income: 6350, rpp: 91.4, pop: 98 },
    { name: "Anniston-Oxford, AL", income: 4967, rpp: 87.2, pop: 113 },
    { name: "Atlantic City-Hammonton, NJ", income: 14248, rpp: 97.2, pop: 266 },
    { name: "Auburn-Opelika, AL", income: 8318, rpp: 88.9, pop: 164 },
    { name: "Augusta-Richmond County, GA-SC", income: 29941, rpp: 91.0, pop: 608 },
    { name: "Bangor, ME", income: 7622, rpp: 91.5, pop: 153 },
    { name: "Barnstable Town, MA", income: 16832, rpp: 105.8, pop: 215 },
    { name: "Battle Creek, MI", income: 6027, rpp: 88.2, pop: 134 },
    { name: "Bay City, MI", income: 4949, rpp: 90.6, pop: 103 },
    { name: "Beaumont-Port Arthur, TX", income: 18755, rpp: 90.2, pop: 403 },
    { name: "Beckley, WV", income: 5187, rpp: 89.6, pop: 117 },
    { name: "Bellingham, WA", income: 11500, rpp: 104.1, pop: 231 },
    { name: "Binghamton, NY", income: 11652, rpp: 91.6, pop: 239 },
    { name: "Bismarck, ND", income: 9075, rpp: 89.6, pop: 130 },
    { name: "Blacksburg-Christiansburg, VA", income: 7678, rpp: 90.7, pop: 181 },
    { name: "Bloomington, IL", income: 9425, rpp: 92.0, pop: 191 },
    { name: "Bloomington, IN", income: 8117, rpp: 93.4, pop: 192 },
    { name: "Bloomsburg-Berwick, PA", income: 4335, rpp: 90.3, pop: 85 },
    { name: "Bowling Green, KY", income: 8159, rpp: 90.5, pop: 186 },
    { name: "Bremerton-Silverdale-Port Orchard, WA", income: 15855, rpp: 107.5, pop: 280 },
    { name: "Brownsville-Harlingen, TX", income: 16048, rpp: 85.2, pop: 449 },
    { name: "Brunswick, GA", income: 6197, rpp: 89.7, pop: 120 },
    { name: "Burlington, NC", income: 8258, rpp: 92.7, pop: 170 },
    { name: "Burlington-South Burlington, VT", income: 13630, rpp: 100.0, pop: 225 },
    { name: "California-Lexington Park, MD", income: 6728, rpp: 100.2, pop: 113 },
    { name: "Canton-Massillon, OH", income: 21218, rpp: 88.5, pop: 397 },
    { name: "Cape Girardeau, MO-IL", income: 5093, rpp: 86.3, pop: 99 },
    { name: "Carbondale-Marion, IL", income: 6545, rpp: 87.2, pop: 125 },
    { name: "Carson City, NV", income: 3258, rpp: 94.1, pop: 58 },
    { name: "Casper, WY", income: 5780, rpp: 91.8, pop: 80 },
    { name: "Chambersburg-Waynesboro, PA", income: 8160, rpp: 93.9, pop: 154 },
    { name: "Champaign-Urbana, IL", income: 12151, rpp: 90.8, pop: 239 },
    { name: "Charleston, WV", income: 13229, rpp: 88.4, pop: 258 },
    { name: "Charlottesville, VA", income: 17180, rpp: 98.6, pop: 249 },
    { name: "Cheyenne, WY", income: 6017, rpp: 90.9, pop: 100 },
    { name: "Chico, CA", income: 9362, rpp: 104.6, pop: 230 },
    { name: "Clarksville, TN-KY", income: 15674, rpp: 92.1, pop: 314 },
    { name: "Cleveland, TN", income: 5808, rpp: 90.9, pop: 127 },
    { name: "Coeur d'Alene, ID", income: 10147, rpp: 96.9, pop: 178 },
    { name: "College Station-Bryan, TX", income: 13291, rpp: 90.7, pop: 269 },
    { name: "Columbia, MO", income: 11967, rpp: 89.3, pop: 186 },
    { name: "Columbus, GA-AL", income: 15076, rpp: 88.8, pop: 321 },
    { name: "Columbus, IN", income: 5072, rpp: 90.3, pop: 83 },
    { name: "Corvallis, OR", income: 4608, rpp: 106.4, pop: 95 },
    { name: "Crestview-Fort Walton Beach-Destin, FL", income: 18093, rpp: 98.0, pop: 285 },
    { name: "Cumberland, MD-WV", income: 4494, rpp: 85.8, pop: 99 },
    { name: "Dalton, GA", income: 6049, rpp: 90.3, pop: 143 },
    { name: "Danville, IL", income: 3532, rpp: 86.8, pop: 76 },
    { name: "Daphne-Fairhope-Foley, AL", income: 13569, rpp: 94.7, pop: 230 },
    { name: "Davenport-Moline-Rock Island, IA-IL", income: 21255, rpp: 89.3, pop: 379 },
    { name: "Decatur, AL", income: 7106, rpp: 90.1, pop: 152 },
    { name: "Decatur, IL", income: 5799, rpp: 86.6, pop: 105 },
    { name: "Deltona-Daytona Beach-Ormond Beach, FL", income: 34821, rpp: 98.7, pop: 666 },
    { name: "Dover, DE", income: 9040, rpp: 91.7, pop: 185 },
    { name: "Dubuque, IA", income: 5858, rpp: 89.1, pop: 97 },
    { name: "Duluth, MN-WI", income: 16027, rpp: 87.0, pop: 291 },
    { name: "East Stroudsburg, PA", income: 7899, rpp: 95.7, pop: 170 },
    { name: "Eau Claire, WI", income: 9409, rpp: 91.4, pop: 172 },
    { name: "El Centro, CA", income: 7141, rpp: 100.1, pop: 181 },
    { name: "Elizabethtown-Fort Knox, KY", income: 7880, rpp: 89.4, pop: 153 },
    { name: "Elkhart-Goshen, IN", income: 10877, rpp: 92.6, pop: 207 },
    { name: "Elmira, NY", income: 3950, rpp: 92.2, pop: 84 },
    { name: "Enid, OK", income: 3063, rpp: 86.1, pop: 61 },
    { name: "Erie, PA", income: 13299, rpp: 91.5, pop: 270 },
    { name: "Fairbanks, AK", income: 5539, rpp: 99.4, pop: 97 },
    { name: "Fargo, ND-MN", income: 16690, rpp: 89.4, pop: 255 },
    { name: "Farmington, NM", income: 5342, rpp: 86.5, pop: 130 },
    { name: "Fayetteville, NC", income: 23124, rpp: 91.4, pop: 523 },
    { name: "Flagstaff, AZ", income: 8162, rpp: 91.3, pop: 146 },
    { name: "Flint, MI", income: 19522, rpp: 89.8, pop: 405 },
    { name: "Florence, SC", income: 10061, rpp: 88.0, pop: 205 },
    { name: "Florence-Muscle Shoals, AL", income: 7108, rpp: 85.6, pop: 147 },
    { name: "Fond du Lac, WI", income: 5589, rpp: 92.8, pop: 103 },
    { name: "Fort Smith, AR-OK", income: 11480, rpp: 85.1, pop: 250 },
    { name: "Gadsden, AL", income: 4446, rpp: 87.0, pop: 102 },
    { name: "Gainesville, FL", income: 16370, rpp: 96.9, pop: 331 },
    { name: "Gainesville, GA", income: 11288, rpp: 96.1, pop: 215 },
    { name: "Gettysburg, PA", income: 5637, rpp: 92.7, pop: 103 },
    { name: "Glens Falls, NY", income: 6583, rpp: 93.6, pop: 124 },
    { name: "Goldsboro, NC", income: 5582, rpp: 89.7, pop: 124 },
    { name: "Grand Forks, ND-MN", income: 6205, rpp: 86.2, pop: 101 },
    { name: "Grand Island, NE", income: 4410, rpp: 87.3, pop: 85 },
    { name: "Grand Junction, CO", income: 8310, rpp: 92.1, pop: 157 },
    { name: "Grants Pass, OR", income: 3991, rpp: 100.7, pop: 88 },
    { name: "Great Falls, MT", income: 4585, rpp: 92.6, pop: 82 },
    { name: "Greeley, CO", income: 19474, rpp: 96.0, pop: 332 },
    { name: "Greenville, NC", income: 9054, rpp: 91.6, pop: 185 },
    { name: "Gulfport-Biloxi, MS", income: 18956, rpp: 89.3, pop: 420 },
    { name: "Hagerstown-Martinsburg, MD-WV", income: 14716, rpp: 95.1, pop: 283 },
    { name: "Hammond, LA", income: 6675, rpp: 87.5, pop: 133 },
    { name: "Hanford-Corcoran, CA", income: 5676, rpp: 98.4, pop: 152 },
    { name: "Harrisonburg, VA", income: 6333, rpp: 93.2, pop: 135 },
    { name: "Hattiesburg, MS", income: 7749, rpp: 89.3, pop: 162 },
    { name: "Hickory-Lenoir-Morganton, NC", income: 18009, rpp: 89.2, pop: 365 },
    { name: "Hilton Head Island-Bluffton, SC", income: 15293, rpp: 95.7, pop: 232 },
    { name: "Hinesville, GA", income: 3242, rpp: 93.9, pop: 79 },
    { name: "Homosassa Springs, FL", income: 6853, rpp: 95.4, pop: 151 },
    { name: "Hot Springs, AR", income: 5078, rpp: 85.8, pop: 100 },
    { name: "Houma-Thibodaux, LA", income: 10381, rpp: 88.6, pop: 211 },
    { name: "Idaho Falls, ID", income: 8946, rpp: 89.9, pop: 150 },
    { name: "Iowa City, IA", income: 10693, rpp: 91.8, pop: 177 },
    { name: "Ithaca, NY", income: 4715, rpp: 98.9, pop: 105 },
    { name: "Jackson, MI", income: 6980, rpp: 92.7, pop: 158 },
    { name: "Jackson, MS", income: 31056, rpp: 90.7, pop: 578 },
    { name: "Jackson, TN", income: 9056, rpp: 87.3, pop: 181 },
    { name: "Jacksonville, NC", income: 10399, rpp: 91.6, pop: 196 },
    { name: "Janesville-Beloit, WI", income: 8419, rpp: 91.4, pop: 163 },
    { name: "Jefferson City, MO", income: 8129, rpp: 87.7, pop: 151 },
    { name: "Johnson City, TN", income: 10292, rpp: 88.9, pop: 202 },
    { name: "Johnstown, PA", income: 6285, rpp: 88.1, pop: 133 },
    { name: "Jonesboro, AR", income: 6507, rpp: 85.7, pop: 137 },
    { name: "Joplin, MO", income: 8586, rpp: 85.6, pop: 179 },
    { name: "Kahului-Wailuku-Lahaina, HI", income: 8074, rpp: 106.3, pop: 167 },
    { name: "Kalamazoo-Portage, MI", income: 14773, rpp: 94.0, pop: 341 },
    { name: "Kankakee, IL", income: 5125, rpp: 92.3, pop: 109 },
    { name: "Kennewick-Richland, WA", income: 14297, rpp: 99.0, pop: 307 },
    { name: "Killeen-Temple, TX", income: 22850, rpp: 91.8, pop: 450 },
    { name: "Kingsport-Bristol, TN-VA", income: 15531, rpp: 85.4, pop: 305 },
    { name: "Kingston, NY", income: 10160, rpp: 99.0, pop: 178 },
    { name: "Kokomo, IN", income: 3916, rpp: 89.7, pop: 82 },
    { name: "La Crosse-Onalaska, WI-MN", income: 7917, rpp: 91.3, pop: 139 },
    { name: "Lafayette-West Lafayette, IN", income: 10536, rpp: 91.5, pop: 231 },
    { name: "Lake Charles, LA", income: 10873, rpp: 86.7, pop: 210 },
    { name: "Lake Havasu City-Kingman, AZ", income: 9680, rpp: 89.9, pop: 211 },
    { name: "Laredo, TX", income: 10902, rpp: 87.8, pop: 275 },
    { name: "Las Cruces, NM", income: 10001, rpp: 89.3, pop: 219 },
    { name: "Lawrence, KS", income: 6263, rpp: 91.0, pop: 123 },
    { name: "Lawton, OK", income: 6209, rpp: 87.6, pop: 130 },
    { name: "Lebanon, PA", income: 7406, rpp: 95.3, pop: 141 },
    { name: "Lewiston, ID-WA", income: 3550, rpp: 87.2, pop: 63 },
    { name: "Lewiston-Auburn, ME", income: 5078, rpp: 100.1, pop: 108 },
    { name: "Lima, OH", income: 5171, rpp: 87.6, pop: 103 },
    { name: "Logan, UT-ID", income: 7086, rpp: 92.9, pop: 141 },
    { name: "Longview, TX", income: 14737, rpp: 88.4, pop: 287 },
    { name: "Longview, WA", income: 5471, rpp: 99.4, pop: 110 },
    { name: "Lubbock, TX", income: 16548, rpp: 90.9, pop: 322 },
    { name: "Lynchburg, VA", income: 12489, rpp: 90.3, pop: 265 },
    { name: "Macon-Bibb County, GA", income: 10581, rpp: 90.0, pop: 232 },
    { name: "Madera, CA", income: 6145, rpp: 102.9, pop: 159 },
    { name: "Mankato, MN", income: 5621, rpp: 87.6, pop: 102 },
    { name: "Mansfield, OH", income: 5778, rpp: 86.6, pop: 121 },
    { name: "McAllen-Edinburg-Mission, TX", income: 30020, rpp: 85.6, pop: 879 },
    { name: "Medford, OR", income: 11110, rpp: 103.3, pop: 223 },
    { name: "Merced, CA", income: 11381, rpp: 99.5, pop: 281 },
    { name: "Michigan City-La Porte, IN", income: 5362, rpp: 92.1, pop: 110 },
    { name: "Midland, MI", income: 4947, rpp: 90.6, pop: 83 },
    { name: "Midland, TX", income: 22956, rpp: 94.8, pop: 178 },
    { name: "Missoula, MT", income: 7438, rpp: 93.1, pop: 119 },
    { name: "Mobile, AL", income: 19993, rpp: 89.4, pop: 430 },
    { name: "Monroe, LA", income: 9909, rpp: 83.6, pop: 177 },
    { name: "Monroe, MI", income: 8293, rpp: 93.2, pop: 149 },
    { name: "Montgomery, AL", income: 18815, rpp: 90.8, pop: 374 },
    { name: "Morgantown, WV", income: 7031, rpp: 92.3, pop: 139 },
    { name: "Morristown, TN", income: 6856, rpp: 87.7, pop: 138 },
    { name: "Mount Vernon-Anacortes, WA", income: 6925, rpp: 106.0, pop: 131 },
    { name: "Muncie, IN", income: 5010, rpp: 88.8, pop: 114 },
    { name: "Muskegon, MI", income: 7887, rpp: 91.7, pop: 174 },
    { name: "Myrtle Beach-Conway-North Myrtle Beach, SC-NC", income: 27075, rpp: 92.8, pop: 481 },
    { name: "Napa, CA", income: 9414, rpp: 111.8, pop: 143 },
    { name: "Naples-Marco Island, FL", income: 42748, rpp: 105.8, pop: 384 },
    { name: "New Bern, NC", income: 6585, rpp: 89.9, pop: 126 },
    { name: "Niles, MI", income: 8631, rpp: 89.7, pop: 155 },
    { name: "Norwich-New London, CT", income: 15512, rpp: 100.4, pop: 270 },
    { name: "Ocala, FL", income: 16664, rpp: 95.5, pop: 369 },
    { name: "Ocean City, NJ", income: 6123, rpp: 101.5, pop: 92 },
    { name: "Odessa, TX", income: 8762, rpp: 92.1, pop: 166 },
    { name: "Olympia-Lacey-Tumwater, WA", income: 15388, rpp: 106.5, pop: 293 },
    { name: "Oshkosh-Neenah, WI", income: 9477, rpp: 90.7, pop: 172 },
    { name: "Owensboro, KY", income: 5957, rpp: 90.0, pop: 120 },
    { name: "Panama City, FL", income: 9079, rpp: 98.0, pop: 182 },
    { name: "Parkersburg-Vienna, WV", income: 4828, rpp: 88.2, pop: 91 },
    { name: "Pine Bluff, AR", income: 3662, rpp: 80.3, pop: 90 },
    { name: "Pittsfield, MA", income: 8048, rpp: 93.0, pop: 127 },
    { name: "Pocatello, ID", income: 4653, rpp: 87.8, pop: 93 },
    { name: "Port St. Lucie, FL", income: 32093, rpp: 101.7, pop: 489 },
    { name: "Poughkeepsie-Newburgh-Middletown, NY", income: 34773, rpp: 109.7, pop: 679 },
    { name: "Prescott Valley-Prescott, AZ", income: 12188, rpp: 95.0, pop: 239 },
    { name: "Pueblo, CO", income: 7455, rpp: 92.4, pop: 169 },
    { name: "Punta Gorda, FL", income: 9636, rpp: 98.4, pop: 188 },
    { name: "Racine, WI", income: 10765, rpp: 95.0, pop: 196 },
    { name: "Rapid City, SD", income: 9485, rpp: 90.3, pop: 150 },
    { name: "Reading, PA", income: 23083, rpp: 96.0, pop: 428 },
    { name: "Redding, CA", income: 8407, rpp: 102.8, pop: 182 },
    { name: "Roanoke, VA", income: 17193, rpp: 90.9, pop: 315 },
    { name: "Rochester, MN", income: 14027, rpp: 93.1, pop: 226 },
    { name: "Rockford, IL", income: 16736, rpp: 90.1, pop: 337 },
    { name: "Rocky Mount, NC", income: 7030, rpp: 88.2, pop: 144 },
    { name: "Rome, GA", income: 4312, rpp: 90.2, pop: 98 },
    { name: "Saginaw, MI", income: 8796, rpp: 89.3, pop: 191 },
    { name: "St. Cloud, MN", income: 11623, rpp: 89.3, pop: 200 },
    { name: "St. George, UT", income: 9535, rpp: 96.1, pop: 184 },
    { name: "St. Joseph, MO-KS", income: 5792, rpp: 87.8, pop: 127 },
    { name: "Salem, OR", income: 20481, rpp: 102.4, pop: 432 },
    { name: "Salinas, CA", income: 21856, rpp: 113.0, pop: 438 },
    { name: "Salisbury, MD-DE", income: 24283, rpp: 95.1, pop: 423 },
    { name: "San Angelo, TX", income: 7330, rpp: 90.9, pop: 123 },
    { name: "San Luis Obispo-Paso Robles, CA", income: 15370, rpp: 110.8, pop: 283 },
    { name: "Santa Cruz-Watsonville, CA", income: 17113, rpp: 112.6, pop: 275 },
    { name: "Santa Fe, NM", income: 10795, rpp: 93.4, pop: 152 },
    { name: "Santa Maria-Santa Barbara, CA", income: 26752, rpp: 113.5, pop: 448 },
    { name: "Savannah, GA", income: 21464, rpp: 95.6, pop: 394 },
    { name: "Sebastian-Vero Beach, FL", income: 15418, rpp: 96.9, pop: 162 },
    { name: "Sebring-Avon Park, FL", income: 4331, rpp: 91.3, pop: 104 },
    { name: "Sheboygan, WI", income: 6892, rpp: 90.8, pop: 115 },
    { name: "Sherman-Denison, TX", income: 7445, rpp: 91.8, pop: 133 },
    { name: "Shreveport-Bossier City, LA", income: 22372, rpp: 87.1, pop: 439 },
    { name: "Sierra Vista-Douglas, AZ", income: 6374, rpp: 86.7, pop: 126 },
    { name: "Sioux City, IA-NE-SD", income: 9214, rpp: 88.1, pop: 143 },
    { name: "Sioux Falls, SD", income: 21292, rpp: 90.3, pop: 283 },
    { name: "South Bend-Mishawaka, IN-MI", income: 16829, rpp: 91.4, pop: 324 },
    { name: "Spartanburg, SC", income: 17573, rpp: 90.6, pop: 343 },
    { name: "Spokane-Spokane Valley, WA", income: 28603, rpp: 101.0, pop: 573 },
    { name: "Springfield, IL", income: 11405, rpp: 90.5, pop: 211 },
    { name: "Springfield, MO", income: 24443, rpp: 89.3, pop: 475 },
    { name: "Springfield, OH", income: 6382, rpp: 88.7, pop: 136 },
    { name: "State College, PA", income: 8136, rpp: 93.2, pop: 162 },
    { name: "Staunton, VA", income: 6397, rpp: 92.6, pop: 124 },
    { name: "Sumter, SC", income: 6441, rpp: 86.3, pop: 107 },
    { name: "Terre Haute, IN", income: 8481, rpp: 88.2, pop: 169 },
    { name: "Texarkana, TX-AR", income: 6811, rpp: 85.3, pop: 150 },
    { name: "The Villages, FL", income: 9522, rpp: 94.3, pop: 133 },
    { name: "Topeka, KS", income: 13005, rpp: 85.9, pop: 233 },
    { name: "Trenton-Princeton, NJ", income: 26243, rpp: 102.1, pop: 371 },
    { name: "Twin Falls, ID", income: 5762, rpp: 88.6, pop: 113 },
    { name: "Tyler, TX", income: 14764, rpp: 92.4, pop: 235 },
    { name: "Utica-Rome, NY", income: 14292, rpp: 92.3, pop: 290 },
    { name: "Valdosta, GA", income: 6410, rpp: 86.7, pop: 148 },
    { name: "Vallejo, CA", income: 22071, rpp: 109.2, pop: 447 },
    { name: "Victoria, TX", income: 5365, rpp: 90.6, pop: 99 },
    { name: "Vineland-Bridgeton, NJ", income: 6671, rpp: 93.7, pop: 151 },
    { name: "Visalia, CA", income: 18990, rpp: 101.3, pop: 469 },
    { name: "Waco, TX", income: 14017, rpp: 90.8, pop: 285 },
    { name: "Walla Walla, WA", income: 2947, rpp: 98.0, pop: 64 },
    { name: "Warner Robins, GA", income: 9053, rpp: 91.6, pop: 192 },
    { name: "Waterloo-Cedar Falls, IA", income: 9078, rpp: 88.0, pop: 169 },
    { name: "Watertown-Fort Drum, NY", income: 5792, rpp: 90.5, pop: 116 },
    { name: "Wausau-Weston, WI", income: 9495, rpp: 90.1, pop: 169 },
    { name: "Weirton-Steubenville, WV-OH", income: 5388, rpp: 88.8, pop: 116 },
    { name: "Wenatchee, WA", income: 6354, rpp: 102.0, pop: 121 },
    { name: "Wheeling, WV-OH", income: 7150, rpp: 89.0, pop: 140 },
    { name: "Wichita Falls, TX", income: 7875, rpp: 88.9, pop: 151 },
    { name: "Williamsport, PA", income: 5424, rpp: 92.7, pop: 113 },
    { name: "Wilmington, NC", income: 16387, rpp: 97.1, pop: 301 },
    { name: "Winchester, VA-WV", income: 8063, rpp: 94.3, pop: 139 }
  ];

  // Calculate per capita income and ratio
  const processedData = useMemo(() => {
    const userIncomeNum = parseFloat(userIncome) || 0;
    const nationalBaseCOL = 77280; // National average base cost of living
    
    const data = msaData.map(msa => {
      const perCapitaIncome = (msa.income / msa.pop) * 1000; // Convert to actual dollars
      const ratio = (perCapitaIncome / (msa.rpp * 1000)) * 100; // Income as % of cost of living
      const userDelta = userIncomeNum > 0 ? ((userIncomeNum - perCapitaIncome) / (msa.rpp * 1000)) * 100 : null;
      
      // Calculate local base cost of living: National Base COL * (RPP / 100)
      const localBaseCOL = nationalBaseCOL * (msa.rpp / 100);
      const disposableIncome = userIncomeNum > 0 ? userIncomeNum - localBaseCOL : null;
      const adjustedDisposable = disposableIncome !== null ? disposableIncome * (100 / msa.rpp) : null;
      
      return {
        ...msa,
        perCapitaIncome,
        ratio,
        userDelta,
        localBaseCOL,
        disposableIncome,
        adjustedDisposable
      };
    });
    
    // Calculate mean and standard deviation for ratio
    const ratios = data.map(d => d.ratio);
    const mean = ratios.reduce((a, b) => a + b, 0) / ratios.length;
    const variance = ratios.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / ratios.length;
    const stdDev = Math.sqrt(variance);
    
    return {
      data,
      mean,
      stdDev,
      // One standard deviation above mean (~84th percentile)
      highThreshold: mean + stdDev,
      // One standard deviation below mean (~16th percentile)  
      lowThreshold: mean - stdDev
    };
  }, [userIncome]);

  // Filter and sort
  const filteredAndSorted = useMemo(() => {
    let filtered = processedData.data.filter(msa =>
      msa.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      if (sortField === 'name') {
        return sortDirection === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return filtered;
  }, [processedData, searchTerm, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-white">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          U.S. Metropolitan Areas: Income vs Cost of Living
        </h1>
        <p className="text-gray-600 mb-4">
          Per capita income as percentage of Regional Price Parity (RPP). Higher ratios indicate greater purchasing power.
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Data: 2023 Real Personal Income and Regional Price Parities (BEA, Dec 2024)
        </p>
        
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search metropolitan areas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="mt-4">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">
              Your Pre-Tax Income:
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input
                type="number"
                placeholder="e.g., 75000"
                value={userIncome}
                onChange={(e) => setUserIncome(e.target.value)}
                className="pl-7 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-40"
              />
            </div>
          </div>
          <p className="text-sm text-gray-500 italic mt-1 ml-0">
            Enter an income to view more metrics
          </p>
        </div>
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-1 text-xs font-medium text-gray-700 uppercase tracking-wider hover:text-gray-900"
                >
                  <span>Metropolitan Area</span>
                  <ArrowUpDown className="h-4 w-4" />
                </button>
              </th>
              <th className="px-6 py-3 text-right">
                <button
                  onClick={() => handleSort('perCapitaIncome')}
                  className="flex items-center justify-end space-x-1 text-xs font-medium text-gray-700 uppercase tracking-wider hover:text-gray-900 ml-auto"
                >
                  <span>Per Capita Income</span>
                  <ArrowUpDown className="h-4 w-4" />
                </button>
              </th>
              <th className="px-6 py-3 text-right">
                <button
                  onClick={() => handleSort('rpp')}
                  className="flex items-center justify-end space-x-1 text-xs font-medium text-gray-700 uppercase tracking-wider hover:text-gray-900 ml-auto"
                >
                  <span>RPP (US Avg = 100)</span>
                  <ArrowUpDown className="h-4 w-4" />
                </button>
              </th>
              <th className="px-6 py-3 text-right">
                <button
                  onClick={() => handleSort('ratio')}
                  className="flex items-center justify-end space-x-1 text-xs font-medium text-gray-700 uppercase tracking-wider hover:text-gray-900 ml-auto"
                >
                  <span>Income/Cost Ratio</span>
                  <ArrowUpDown className="h-4 w-4" />
                </button>
              </th>
              {userIncome && (
                <th className="px-6 py-3 text-right">
                  <button
                    onClick={() => handleSort('userDelta')}
                    className="flex items-center justify-end space-x-1 text-xs font-medium text-gray-700 uppercase tracking-wider hover:text-gray-900 ml-auto"
                  >
                    <span>Your Advantage/Disadvantage</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
              )}
              {userIncome && (
                <th className="px-6 py-3 text-right">
                  <button
                    onClick={() => handleSort('disposableIncome')}
                    className="flex items-center justify-end space-x-1 text-xs font-medium text-gray-700 uppercase tracking-wider hover:text-gray-900 ml-auto"
                  >
                    <span>Your Disposable Income</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
              )}
              {userIncome && (
                <th className="px-6 py-3 text-right">
                  <button
                    onClick={() => handleSort('adjustedDisposable')}
                    className="flex items-center justify-end space-x-1 text-xs font-medium text-gray-700 uppercase tracking-wider hover:text-gray-900 ml-auto"
                  >
                    <span>Normalized Disposable</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSorted.map((msa, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {msa.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                  {formatCurrency(msa.perCapitaIncome)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                  {msa.rpp.toFixed(1)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                    msa.ratio >= processedData.highThreshold ? 'bg-green-100 text-green-800' :
                    msa.ratio >= processedData.lowThreshold ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {msa.ratio.toFixed(1)}%
                  </span>
                </td>
                {userIncome && (
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                      msa.userDelta > 5 ? 'bg-green-100 text-green-800' :
                      msa.userDelta > -5 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {msa.userDelta > 0 ? '+' : ''}{msa.userDelta.toFixed(1)}%
                    </span>
                  </td>
                )}
                {userIncome && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    <span className={`font-medium ${
                      msa.disposableIncome > 0 ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {formatCurrency(msa.disposableIncome)}
                    </span>
                  </td>
                )}
                {userIncome && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    <span className={`font-medium ${
                      msa.adjustedDisposable > 0 ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {formatCurrency(msa.adjustedDisposable)}
                    </span>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 text-sm text-gray-600">
        <p className="mb-2"><strong>Showing {filteredAndSorted.length} of {processedData.data.length} metropolitan areas</strong></p>
        <p className="mb-2 text-xs text-gray-500">
          Distribution: Mean = {processedData.mean.toFixed(1)}%, Std Dev = {processedData.stdDev.toFixed(1)}%
        </p>
        <p className="mb-1"><strong>How to read this data:</strong></p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Higher ratios indicate that income goes further relative to local costs</li>
          <li>RPP values above 100 indicate areas more expensive than the U.S. average</li>
          <li>Green (≥{processedData.highThreshold.toFixed(1)}%): Above average purchasing power (+1 std dev, top ~16%)</li>
          <li>Yellow ({processedData.lowThreshold.toFixed(1)}%-{processedData.highThreshold.toFixed(1)}%): Average purchasing power (middle ~68%)</li>
          <li>Red (&lt;{processedData.lowThreshold.toFixed(1)}%): Below average purchasing power (-1 std dev, bottom ~16%)</li>
          {userIncome && (
            <>
              <li className="font-medium text-blue-700">Your Advantage/Disadvantage: Shows how much more (+) or less (-) purchasing power you'd have compared to the local per capita average, adjusted for cost of living</li>
              <li className="font-medium text-blue-700">Your Disposable Income: Your pre-tax income minus the local base cost of living (national average $77,280 × RPP/100) - actual dollars available for saving/investing</li>
              <li className="font-medium text-blue-700">Normalized Disposable: Your disposable income normalized to national average prices (Disposable Income × 100/RPP) - shows equivalent local purchasing power across metros</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default MSAIncomeData;