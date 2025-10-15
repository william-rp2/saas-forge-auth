import { supabase } from "@/integrations/supabase/client";

export interface FeaturesEntity {
  id?: string;
  key: string;
  name: string;
  description: string;
}

export interface PlanFeaturesEntity {
  plan_id: string;
  feature_id: string;
}

const DATABASE_NAME: string = "features";
const RELATION_DATABASE_NAME: string = "plan_features";

export const FeaturesRepository = {
  findAll: async (): Promise<FeaturesEntity[]> => {
    const { data: features, error } = await supabase.from(DATABASE_NAME).select();

    if (error) {
      console.error("An error has occurred while find all plans features. ERROR: ", error);
      throw error;
    }

    return features;
  },
  findById: async (id: string): Promise<FeaturesEntity> => {
    const { data: feature, error } = await supabase.from(DATABASE_NAME).select().eq('id', id).single();

    if (error) {
      console.error("An error has occurred while find a feature by id. ERROR: ", error);
      throw error;
    }

    return feature;
  },
  findByPlanId: async (planId: string): Promise<FeaturesEntity[]> => {
    const planFeatures: PlanFeaturesEntity[] = await PlansFeatureRepository.findByPlanId(planId);
    //- Plan feature founded
    const features: FeaturesEntity[] = [];
    for (const feature of planFeatures) {
      features.push(await FeaturesRepository.findById(feature.feature_id));
    }
    return features;
  }
};

export const PlansFeatureRepository = {
  findByPlanId: async (planId: string): Promise<PlanFeaturesEntity[]> => {
    const {data: planFeature, error: planFeatureError} = await supabase.from(RELATION_DATABASE_NAME).select().eq('plan_id', planId);

    if (planFeatureError) {
      console.error("An error has occurred while find a feature plan. ERROR: ", planFeatureError);
    }

    return planFeature;
  },
  findByFeatureId: async (featureId: string): Promise<PlanFeaturesEntity[]> => {
    const {data: planFeature, error: planFeatureError} = await supabase.from(RELATION_DATABASE_NAME).select().eq('feature_id', featureId);

    if (planFeatureError) {
      console.error("An error has occurred while find a feature plan. ERROR: ", planFeatureError);
    }

    return planFeature;
  },
  save: async (planFeature: PlanFeaturesEntity[]): Promise<void> => {
    const { data: planFeatureSaved, error } = await supabase.from(RELATION_DATABASE_NAME).insert(planFeature);

    if (error) {
      console.error("An error has occurred while save a plan / feature relation. ERROR: ", error);
      throw error;
    }
  },
  update: async (planId: string, featuresIds: string[]): Promise<void> => {
    const { data: deletePlanFeature, error: deletePlanFeatureError } = await supabase.from(RELATION_DATABASE_NAME).delete().eq('plan_id', planId);

    if (deletePlanFeatureError) {
      console.error("An error has occurred while update features plan. ERROR: ", deletePlanFeatureError);
      throw deletePlanFeatureError;
    }

    const { data: update, error: updateError } = await supabase.from(RELATION_DATABASE_NAME).insert(featuresIds.map(featureId => ({ plan_id: planId, feature_id: featureId })));

    if (updateError) {
      console.error("An error has occurred while update features plan. UPDATE::ERROR: ", updateError);
      throw updateError;
    }
  }
};