ALTER PROCEDURE stg.spInnovGetCamapigns AS

    SELECT
        c.Id                                id,
        c.UniqueId                          uniqueId,
        c.PrimaryName                       campaign,
        c.SecondaryName                     altcampaign,
        ISNULL(c.ArchiveReason, 'ACTIVE')   [status],
        c.[Description]                     [description],
        c.InternalCampaignId                internalid,
        ccb.PurchaseOrderNr                 ponumber,
        co.Name                             contact,
        c.[StartDate]                       startdate,
        c.[EndDate]                         enddate,
        c.Timing                            timing,
        l.URL                               [url],
        ab.PrimaryName                      agency,
        ab.CountryCode                      countrycode,
        a.PrimaryName                       advertiser,
        a.SecondaryName                     altadvertiser,
        b.PrimaryName                       brand,
        b.SecondaryName                     altbrand,
        COALESCE(c.Updated, c.Created)      updated
    FROM apac.Campaign c
    JOIN apac.AgencyBranch ab ON (c.AgencyBranchId = ab.OrganisationId)
    JOIN apac.Advertiser a ON (c.AdvertiserId = a.OrganisationId)
    JOIN apac.LandingPage l ON (c.DefaultLandingPageId = l.Id)
    JOIN apac.CampaignBrandMapping cb ON (c.Id = cb.CampaignId)
    JOIN apac.Brand b ON (cb.BrandId = b.Id)
    JOIN apac.Contact co ON (c.AgencyContactId = co.Id)
    JOIN apac.CampaignCountryBudget ccb ON (c.Id = ccb.CampaignId AND ccb.CountryCode = 'AUS')
    WHERE c.StartDate > '2019-01-01'
    ORDER BY c.Id DESC;