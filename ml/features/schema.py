"""
ml/features/schema.py
Canonical Feature Schema and Definitions for Sanchay AI.
Defines every feature's type, source, lifecycle stage, missing-value behavior, and calculation rules.
"""
from __future__ import annotations
from dataclasses import dataclass
from enum import Enum
from typing import Any, Callable, Dict, List, Optional


class LifecycleStage(str, Enum):
    AVAILABLE_AT_SANCTION = "AVAILABLE_AT_SANCTION"
    AVAILABLE_AT_WORK_ORDER = "AVAILABLE_AT_WORK_ORDER"
    AVAILABLE_DURING_EXECUTION = "AVAILABLE_DURING_EXECUTION"
    AVAILABLE_AT_COMPLETION = "AVAILABLE_AT_COMPLETION"
    POST_AUDIT = "POST_AUDIT"


class FeatureType(str, Enum):
    NUMERIC = "numeric"
    BINARY = "binary"
    CATEGORICAL = "categorical"
    COUNT = "count"
    RATIO = "ratio"


@dataclass
class FeatureDefinition:
    feature_name: str
    feature_type: FeatureType
    domain: str
    lifecycle_stage: LifecycleStage
    description: str
    source_fields: List[str]
    default_missing: float
    missing_indicator_feature: Optional[str] = None
    safe_for_prediction: bool = True
    version: str = "2.0.0"


# Canonical feature ordering used across ML training, batch evaluation, and inference
CANONICAL_FEATURES: List[str] = [
    'sanction_amount', 'released_amount', 'expenditure_amount', 'estimated_cost', 'unspent_amount',
    'cost_to_sanction_ratio', 'sanction_to_estimate_ratio', 'release_to_sanction_ratio',
    'expenditure_to_release_ratio', 'expenditure_to_sanction_ratio', 'balance_to_sanction_ratio',
    'balance_to_release_ratio', 'cost_overrun_amount', 'cost_overrun_percentage', 'revised_estimate_ratio',
    'tender_to_estimate_ratio', 'actual_to_tender_ratio', 'payment_to_work_order_ratio',
    'payment_to_completion_ratio', 'payment_before_progress_ratio', 'payment_concentration_index',
    'largest_payment_percentage', 'largest_payment_amount', 'payment_count', 'payment_velocity',
    'sor_deviation_ratio', 'peer_cost_deviation_zscore', 'utilization_ratio', 'monthly_spending_variance',
    'monthly_spending_zscore', 'quarterly_spending_zscore', 'round_amount_flag', 'repeated_amount_flag',
    'rapid_payment_sequence_flag', 'planned_duration_days', 'actual_duration_days', 'delay_days',
    'delay_ratio', 'extension_count', 'days_from_sanction_to_work_order',
    'days_from_work_order_to_first_payment', 'days_from_work_order_to_first_progress',
    'days_between_payments', 'payment_frequency', 'payment_acceleration', 'progress_acceleration',
    'progress_deceleration', 'time_since_last_payment', 'time_since_last_inspection',
    'time_since_last_progress_update', 'status_change_frequency', 'status_reversal_count',
    'extension_frequency', 'extension_duration_total', 'project_velocity', 'financial_velocity',
    'physical_velocity', 'velocity_mismatch', 'financial_physical_gap', 'physical_progress',
    'financial_progress', 'contractor_total_projects', 'contractor_completed_projects',
    'contractor_delayed_projects', 'contractor_abandoned_projects', 'contractor_total_value',
    'contractor_average_project_value', 'contractor_max_project_value', 'contractor_win_rate',
    'contractor_repeat_winner_rate', 'contractor_single_bid_win_rate', 'contractor_competitor_count',
    'contractor_avg_delay', 'contractor_avg_cost_overrun', 'contractor_avg_payment_velocity',
    'contractor_irregularity_score', 'contractor_state_count', 'contractor_district_count',
    'contractor_constituency_count', 'contractor_project_concentration', 'contractor_client_concentration',
    'contractor_agency_count', 'contractor_agency_repeat_rate', 'contractor_agency_win_rate',
    'contractor_district_repeat_rate', 'contractor_constituency_repeat_rate', 'contractor_pair_frequency',
    'agency_contractor_network_density', 'contractor_market_share', 'contractor_capacity_strain',
    'contractor_past_irregularity_rate', 'bid_count', 'single_bid_flag', 'lowest_bid_deviation',
    'second_lowest_bid_deviation', 'winning_vs_second_bid_ratio', 'bid_spread', 'bid_variance',
    'bid_stddev', 'bidder_concentration', 'bidder_repeat_participation', 'new_bidder_flag',
    'new_contractor_flag', 'incumbent_winner_flag', 'same_contractor_previous_tender_flag',
    'tender_competition_score', 'procurement_risk_score', 'tender_extension_count',
    'tender_cancellation_count', 'tender_reissue_count', 'winning_bid_deviation',
    'bidder_price_similarity', 'tender_duration_days', 'retender_count', 'repeat_winner_rate',
    'project_density_1km', 'project_density_5km', 'project_density_10km', 'same_location_project_count',
    'same_coordinates_project_count', 'same_contractor_nearby_projects', 'same_agency_nearby_projects',
    'nearest_project_distance', 'average_neighbor_distance', 'district_project_density',
    'constituency_project_density', 'contractor_locality_ratio', 'contractor_outside_district_ratio',
    'infrastructure_gap_score', 'geo_cluster_density', 'contractor_district_distance_km',
    'is_high_density_cluster', 'geo_distance_mismatch_km', 'district_population', 'population_density',
    'literacy_rate', 'poverty_rate', 'document_completeness_score', 'document_consistency_score',
    'sanction_document_present', 'technical_sanction_present', 'dpr_present', 'estimate_present',
    'revised_estimate_present', 'tender_document_present', 'bid_document_present', 'work_order_present',
    'invoice_present', 'payment_voucher_present', 'measurement_book_present',
    'utilization_certificate_present', 'completion_certificate_present', 'inspection_report_present',
    'site_verification_present', 'photo_count', 'geotag_photo_count', 'unique_photo_hash_count',
    'document_date_consistency', 'document_sequence_consistency', 'missing_date_count',
    'missing_document_ratio', 'required_document_count', 'available_document_count',
    'missing_mb_flag', 'missing_uc_flag', 'missing_completion_cert_flag', 'missing_geotag_flag',
    'eligibility_violation_count', 'procurement_violation_count', 'documentation_violation_count',
    'financial_violation_count', 'timeline_violation_count', 'payment_violation_count',
    'completion_violation_count', 'total_rule_violation_count', 'critical_rule_violation_count'
]
